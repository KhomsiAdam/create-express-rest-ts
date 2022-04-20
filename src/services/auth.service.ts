import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt, { VerifyErrors } from 'jsonwebtoken';

import { AuthModel } from '@entities/auth/model';
import { FetchedUserInterface, PayloadInterface } from '@entities/auth/interface';
import { cookieName, ErrorMessages } from '@entities/auth/constants';
import { customErrors } from '@helpers/customErrors';

const { JWT_ACCESS_SECRET, REFRESH_TOKEN_ENDPOINT } = process.env;

// Access Token generation when login
export const generateToken = (
  userId: mongoose.Types.ObjectId,
  roleId: mongoose.Types.ObjectId,
  secret: string,
  expiration: string | number,
) => {
  const payload: PayloadInterface = {
    user: userId,
    role: roleId,
  };
  return jwt.sign(payload, secret as string, {
    expiresIn: expiration,
  });
};

// Send refresh token and set to coookie
export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: REFRESH_TOKEN_ENDPOINT,
    maxAge: 24 * 60 * 60 * 1000,
  });
};

// Clear refresh token from cookie
export const clearRefreshToken = (res: Response) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: REFRESH_TOKEN_ENDPOINT,
  });
};

// Verify token and user role if provided
export const verifyAuth = async (req: Request, res: Response, next: NextFunction, role = '') => {
  const authHeader = req.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return customErrors(res, next, ErrorMessages.NOT_AUTHENTICATED, 401);
  const token = authHeader?.split(' ')[1];
  if (!token) return customErrors(res, next, ErrorMessages.NOT_AUTHENTICATED, 401);
  jwt.verify(token, JWT_ACCESS_SECRET as string, async (error: VerifyErrors | null, decoded: any) => {
    if (error) {
      customErrors(res, next, ErrorMessages.TOKEN_EXPIRED, 403);
    }
    if (decoded && role !== '') {
      const authorizedUser = await mongoose.model(role).findOne({ _id: decoded.user });
      if (authorizedUser) {
        next();
      } else {
        customErrors(res, next, ErrorMessages.NOT_AUTHORIZED, 403);
      }
    } else if (decoded && role === '') {
      next();
    }
  });
};

// Finding the existence of a user
export const findUser = async (req: Request) => {
  const fetchedRole = await AuthModel.findOne({
    email: req.body.email,
  });
  if (fetchedRole) {
    const user = (await mongoose
      .model(fetchedRole.role)
      .findOne({ email: req.body.email }, 'email password')) as FetchedUserInterface;
    if (user) {
      req.user = fetchedRole;
      return {
        _id: user._id,
        email: user.email,
        password: user.password,
        role: fetchedRole.role,
      };
    }
    return false;
  }
  return false;
};
