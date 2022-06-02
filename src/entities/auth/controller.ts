import type { Request, Response, NextFunction } from 'express';
import { model } from 'mongoose';
import { verify as jwtVerify } from 'jsonwebtoken';
import { compare as bcryptCompare } from 'bcryptjs';

import { findUser, generateToken, clearRefreshToken, sendRefreshToken } from '@services/auth.service';
import { log } from '@services/logger.service';
import { catchErrors, customError } from '@helpers';

import { UserModel } from '@entities/user/model';
import { AuthModel } from './model';
import { loginSchema, registerSchema } from './validation';
import { SuccessMessages, ErrorMessages } from './constants';
import type { JwtErrors, PayloadData } from './interface';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION } = process.env;

// Register logic
export const register = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  // Register validation
  const { error } = registerSchema.validate(req.body);
  if (error) return customError(res, next, error, 400);
  // Find user by email
  const fetchedUser = await AuthModel.findOne({
    email: req.body.email,
  });
  // If user exists return error else create user
  if (fetchedUser && fetchedUser.role.toLowerCase() === 'admin') {
    return customError(res, next, ErrorMessages.REGISTER_ERROR, 422);
  }
  if (fetchedUser) return customError(res, next, ErrorMessages.DUPLICATE_ERROR, 409);
  // If a role is provided create user with the specified role else create user with default 'User' role
  if (req.body.role) {
    if (req.body.role.toLowerCase() === 'admin') return customError(res, next, ErrorMessages.REGISTER_ERROR, 422);
    // Check if schema/model for that role is registered
    try {
      // Capitalize the provided string
      const RoleModel = model(req.body.role.toUpperCase().charAt(0) + req.body.role.toLowerCase().slice(1));
      // Remove role from body and create user
      delete req.body.role;
      const newUser = new RoleModel(req.body);
      await newUser.save();
      res.json({ message: SuccessMessages.REGISTER_SUCCESS });
    } catch {
      return customError(res, next, ErrorMessages.REGISTER_ERROR, 422);
    }
  } else {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.statusCode = 201;
    res.json({ message: SuccessMessages.REGISTER_SUCCESS });
  }
});

// Login logic
export const login = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return customError(res, next, error, 400);
  const foundUser = await findUser(req);
  if (!foundUser) return customError(res, next, ErrorMessages.LOGIN_ERROR, 422);
  const passwordCompareResult = await bcryptCompare(req.body.password, foundUser.password);
  if (!passwordCompareResult) return customError(res, next, ErrorMessages.LOGIN_ERROR, 422);
  const { cookies } = req;
  // Refresh token array handling
  let newRefreshTokenArray = !cookies?.rtkn
    ? req?.user?.refreshToken
    : req?.user?.refreshToken.filter((rt: string) => rt !== cookies.rtkn);
  // Detect refresh token reuse
  if (cookies?.rtkn) {
    const refreshToken = cookies?.rtkn;
    const compromisedUser = await AuthModel.findOne({ refreshToken }, 'refreshToken');
    if (compromisedUser) {
      // Clear out all previous refresh tokens
      log.warn('Detected refresh token reuse at login.');
      newRefreshTokenArray = [];
      // Deleting the compromised refresh token
      const compromisedUserTokens = compromisedUser.refreshToken.filter((rt: string) => rt !== cookies.rtkn);
      compromisedUser.refreshToken = [...compromisedUserTokens];
      compromisedUser.save();
    }
  }
  // Generate new refresh token
  const newRefreshToken = generateToken(
    foundUser._id,
    req.user._id,
    JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRATION as string | number,
  );
  // Saving refreshToken with current user
  req.user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  await req.user.save();
  // Set refresh token in http only cookie
  sendRefreshToken(res, newRefreshToken);
  // Send access token
  res.json({
    token: generateToken(
      foundUser._id,
      req.user._id,
      JWT_ACCESS_SECRET as string,
      JWT_ACCESS_EXPIRATION as string | number,
    ),
    role: [foundUser.role],
    message: SuccessMessages.LOGGED_IN,
  });
});

// Refresh access token
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req?.cookies?.rtkn;
  if (!refreshToken) return res.json({ message: ErrorMessages.NOT_LOGGED_IN });
  const foundUser = await AuthModel.findOne({ refreshToken }, 'refreshToken role');
  // Detect refresh token reuse
  if (!foundUser) {
    jwtVerify(refreshToken, JWT_REFRESH_SECRET as string, async (error: JwtErrors, decoded: any): Promise<void> => {
      if (error) return customError(res, next, ErrorMessages.FORBIDDEN, 403);
      const payload = decoded as PayloadData;
      // Clear out all previous refresh tokens
      log.warn('Detected refresh token reuse at refresh.');
      await AuthModel.updateOne({ _id: payload.roleId }, { $set: { refreshToken: [] } });
      return customError(res, next, ErrorMessages.FORBIDDEN, 403);
    });
  } else {
    // Handle refresh token array
    const newRefreshTokenArray = foundUser.refreshToken.filter((rt: string) => rt !== refreshToken);
    return jwtVerify(refreshToken, JWT_REFRESH_SECRET as string, async (error: JwtErrors, decoded: any) => {
      // Remove token from db if expired
      if (error) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        await foundUser.save();
        return res.json({ message: ErrorMessages.TOKEN_EXPIRED });
      }
      // Generate new refresh token
      const payload = decoded as PayloadData;
      const newRefreshToken = generateToken(
        payload.userId,
        payload.roleId,
        JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRATION as string | number,
      );
      // Saving refreshToken
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await foundUser.save();
      // Send new refresh and access tokens
      sendRefreshToken(res, newRefreshToken);
      return res.json({
        token: generateToken(
          payload.userId,
          payload.roleId,
          JWT_ACCESS_SECRET as string,
          JWT_ACCESS_EXPIRATION as string | number,
        ),
        role: [foundUser.role],
        message: SuccessMessages.REFRESH_SUCCESS,
      });
    });
  }
};

// Logout user, reset refresh token
export const logout = async (req: Request, res: Response) => {
  const refreshToken = req?.cookies?.rtkn;
  if (!refreshToken) return res.json({ message: ErrorMessages.NOT_LOGGED_IN });
  // Check if user have any refresh token in database
  const foundUser = await AuthModel.findOne({ refreshToken }, 'refreshToken');
  if (!foundUser) {
    // Clear refresh token from cookie
    clearRefreshToken(res);
    return res.json({ message: SuccessMessages.LOGGED_OUT });
  }
  // Delete refreshToken from db
  foundUser.refreshToken = foundUser.refreshToken.filter((rt: string) => rt !== refreshToken);
  await foundUser.save();
  // Clear refresh token from cookie
  clearRefreshToken(res);
  return res.json({ message: SuccessMessages.LOGGED_OUT });
};
