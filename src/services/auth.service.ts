import type { NextFunction, Request, Response } from 'express';
import { Types, model, isValidObjectId } from 'mongoose';
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';
import pluralize from 'pluralize';

import { AuthModel } from '@entities/auth/model';
import type { FoundUserEntity, MaybeUser, JwtErrors, PayloadData } from '@entities/auth/interface';
import { cookieName, ErrorMessages, Permissions } from '@entities/auth/constants';
import { customError } from '@helpers/customError';

const { JWT_ACCESS_SECRET, REFRESH_TOKEN_ENDPOINT } = process.env;

// Access Token generation when login
export const generateToken = (
  payloadUserId: Types.ObjectId,
  payloadRoleId: Types.ObjectId,
  secret: string,
  expiration: string | number,
): string => {
  const payload: PayloadData = {
    userId: payloadUserId,
    roleId: payloadRoleId,
  };
  return jwtSign(payload, secret as string, {
    expiresIn: expiration,
  });
};

// Send refresh token and set to cookie
export const sendRefreshToken = (res: Response, token: string): void => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: REFRESH_TOKEN_ENDPOINT,
    maxAge: 24 * 60 * 60 * 1000,
  });
};

// Clear refresh token from cookie
export const clearRefreshToken = (res: Response): void => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: REFRESH_TOKEN_ENDPOINT,
  });
};

// Verify token and user role if provided
export const verifyAuthAlt = async (req: Request, res: Response, next: NextFunction, role = ''): Promise<void> => {
  const authHeader = req.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return customError(res, next, ErrorMessages.NOT_AUTHENTICATED, 401);
  const token = authHeader?.split(' ')[1];
  if (!token) return customError(res, next, ErrorMessages.NOT_AUTHENTICATED, 401);
  jwtVerify(token, JWT_ACCESS_SECRET as string, async (error: JwtErrors, decoded: any) => {
    if (error) return customError(res, next, ErrorMessages.TOKEN_EXPIRED, 401);
    if (role === '') return next();
    const payload = decoded as PayloadData;
    const authorizedUser = await model(role).findOne({ _id: payload.userId });
    if (!authorizedUser) return customError(res, next, ErrorMessages.NOT_AUTHORIZED, 403);
    next();
  });
};

// Verify token and user role if provided
export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
  role?: string,
  permission?: string,
) => {
  // Get authorization header
  const authHeader = req.get('Authorization');
  // Check for 'Bearer' scheme
  if (!authHeader?.startsWith('Bearer ')) return customError(res, next, ErrorMessages.NOT_AUTHENTICATED, 401);
  // Check for token
  const token = authHeader?.split(' ')[1];
  if (!token) return customError(res, next, ErrorMessages.NOT_AUTHENTICATED, 401);
  try {
    const decoded = jwtVerify(token, JWT_ACCESS_SECRET as string) as PayloadData;
    // Put the decoded token payload in the request
    req.decoded = decoded;
    // Check permission for operations on self
    const { id } = req.params;
    if (permission && permission === Permissions.SELF && id && !new Types.ObjectId(id).equals(decoded.userId))
      return customError(res, next, ErrorMessages.NOT_AUTHORIZED, 403);
    // Check permission for operations on owned entities
    if (permission && permission === Permissions.OWN && id) {
      let isMatchedRefId = false;
      // Get model name from baseUrl and singularize it, then capitalize it
      const modelName = pluralize.singular(req.baseUrl.split('/')[2]);
      const capitalizedModelName = modelName.toUpperCase().charAt(0) + modelName.toLowerCase().slice(1);
      const findOwnedEntity = await model(capitalizedModelName)
        .findOne({ _id: id })
        .select(['-_id', '-createdAt', '-updatedAt', '-__v'])
        .lean();
      // Check if userId exists in the entity as reference
      if (findOwnedEntity) {
        Object.entries(findOwnedEntity).forEach(([_key, val]) => {
          if (isValidObjectId(val) && new Types.ObjectId(val).equals(decoded.userId)) isMatchedRefId = true;
        });
      }
      if (isMatchedRefId) return next();
      if (!isMatchedRefId) return customError(res, next, ErrorMessages.NOT_AUTHORIZED, 403);
    }
    // Token verified and no role provided, user is authenticated
    if (!role && decoded) return next();
    // When role is provided check if user exists with id from token
    if (role) {
      const authorizedUser = await model(role).findOne({ _id: decoded.userId });
      if (!authorizedUser) return customError(res, next, ErrorMessages.NOT_AUTHORIZED, 403);
      return next();
    }
  } catch (error) {
    return customError(res, next, error.message, 401);
  }
};

// Finding the existence of a user
export const findUser = async (req: Request): Promise<MaybeUser> => {
  // Get the user's role and refresh tokens by email from the auth/role collection
  const fetchedRole = await AuthModel.findOne({ email: req.body.email }, 'role refreshToken');
  if (!fetchedRole) return false;
  // Get the user's password by email from the specified collection from the role
  const fetchedUser = (await model(fetchedRole.role).findOne({ email: req.body.email }, 'password')) as FoundUserEntity;
  if (!fetchedUser) return false;
  // Put the user role and refresh tokens in the request and return the fetched user
  req.user = fetchedRole;
  return {
    _id: fetchedUser._id,
    password: fetchedUser.password,
    role: fetchedRole.role,
  };
};
