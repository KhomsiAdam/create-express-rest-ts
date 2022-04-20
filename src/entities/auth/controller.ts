import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { clearRefreshToken, findUser, generateToken, sendRefreshToken } from '@services/auth.service';
import { log } from '@services/logger.service';
import { catchErrors } from '@helpers/catchErrors';
import { customErrors } from '@helpers/customErrors';

import { UserModel } from '@entities/user/model';
import { AuthModel } from './model';
import { loginSchema, registerSchema } from './validation';
import { FetchedUserInterface } from './interface';
import { SuccessMessages, ErrorMessages } from './constants';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION } = process.env;

// Register logic
export const register = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  // Register validation
  const { error } = registerSchema.validate(req.body);
  if (error) {
    if (error.details[0].type === 'any.required') {
      return customErrors(res, next, ErrorMessages.REQUIRED_FIELDS_MISSING, 400);
    }
    return customErrors(res, next, error, 422);
  }
  // Find user
  const fetchedUser = await AuthModel.findOne({
    email: req.body.email,
  });
  if (!fetchedUser) {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.json({ message: SuccessMessages.REGISTER_SUCCESS });
  } else {
    customErrors(res, next, ErrorMessages.REGISTER_ERROR, 409);
  }
});

// Login logic
export const login = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  // Login validation
  const { error } = loginSchema.validate(req.body);
  if (error) {
    if (error.details[0].type === 'any.required') {
      return customErrors(res, next, ErrorMessages.REQUIRED_FIELDS_MISSING, 400);
    }
    return customErrors(res, next, error, 422);
  }
  // Find user
  const foundUser = (await findUser(req)) as FetchedUserInterface;
  // Compare passwords
  if (foundUser) {
    const result = await bcrypt.compare(req.body.password, foundUser.password);
    if (result) {
      // Get cookies
      const { cookies } = req;
      // Refresh token array handling
      let newRefreshTokenArray = !cookies?.rtkn
        ? req?.user?.refreshToken
        : req?.user?.refreshToken.filter((rt: string) => rt !== cookies.rtkn);
      // Detected refresh token reuse
      if (cookies?.rtkn) {
        const refreshToken = cookies?.rtkn;
        const foundToken = await AuthModel.findOne({ refreshToken });
        if (!foundToken) {
          log.warn('Detected refresh token reuse at login.');
          // Clear out all previous refresh tokens
          newRefreshTokenArray = [];
        }
        // Clear refresh token from cookie
        // clearRefreshToken(res);
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
    } else {
      return customErrors(res, next, ErrorMessages.LOGIN_ERROR, 422);
    }
  } else {
    return customErrors(res, next, ErrorMessages.LOGIN_ERROR, 422);
  }
});

// Refresh access token
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  // Get refresh token from cookie
  const refreshToken = req?.cookies?.rtkn;
  if (!refreshToken) return res.json({ message: SuccessMessages.NOT_LOGGED_IN });
  // Search user by refresh token
  const foundUser = (await AuthModel.findOne({ refreshToken })) as FetchedUserInterface;
  // Detected refresh token reuse
  if (!foundUser) {
    jwt.verify(refreshToken, JWT_REFRESH_SECRET as string, async (error: VerifyErrors | null, decoded: any) => {
      if (error) {
        customErrors(res, next, ErrorMessages.FORBIDDEN, 401);
      }
      log.warn('Detected refresh token reuse at refresh.');
      if (decoded) {
        const compromisedUser = (await AuthModel.findOne({ _id: decoded.role })) as FetchedUserInterface;
        compromisedUser.refreshToken = [];
        await compromisedUser.save();
        customErrors(res, next, ErrorMessages.FORBIDDEN, 403);
      }
    });
    customErrors(res, next, ErrorMessages.FORBIDDEN, 403);
  } else {
    // Handle refresh token array
    const newRefreshTokenArray = foundUser.refreshToken.filter((rt: string) => rt !== refreshToken);
    return jwt.verify(refreshToken, JWT_REFRESH_SECRET as string, async (error: VerifyErrors | null, decoded: any) => {
      if (error) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        await foundUser.save();
        return res.json({ message: ErrorMessages.TOKEN_EXPIRED });
      }
      // Generate new refresh token
      const newRefreshToken = generateToken(
        foundUser._id,
        decoded.role,
        JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRATION as string | number,
      );
      // Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await foundUser.save();
      // Send new refresh and access tokens
      sendRefreshToken(res, newRefreshToken);
      return res.json({
        token: generateToken(
          foundUser._id,
          decoded.role,
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
  if (!refreshToken) return res.json({ message: SuccessMessages.NOT_LOGGED_IN });
  // Check if user have any refresh token in database
  const foundUser = (await AuthModel.findOne({ refreshToken })) as FetchedUserInterface;
  if (!foundUser) {
    // Clear refresh token from cookie
    clearRefreshToken(res);
    return res.json({ message: SuccessMessages.LOGGED_OUT });
  }
  // Delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter((rt: string) => rt !== refreshToken);
  await foundUser.save();
  // Clear refresh token from cookie
  clearRefreshToken(res);
  return res.json({ message: SuccessMessages.LOGGED_OUT });
};
