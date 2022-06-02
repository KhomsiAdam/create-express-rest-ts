export enum Roles {
  ADMIN = 'Admin',
  USER = 'User',
}

export enum Permissions {
  SELF = 'Self',
  OWN = 'Own',
}

export enum SuccessMessages {
  REGISTER_SUCCESS = 'Account created successfully.',
  REFRESH_SUCCESS = 'Refresh token updated successfully.',
  LOGGED_IN = 'Logged in successfully.',
  LOGGED_OUT = 'Logged out successfully.',
}

export enum ErrorMessages {
  LOGIN_ERROR = 'Unable to login. Please try again.',
  NOT_LOGGED_IN = 'Not logged in. Please login.',
  REGISTER_ERROR = 'Unable to register. Please try again.',
  DUPLICATE_ERROR = 'User already exists with this email',
  NOT_AUTHORIZED = 'Not authorized. You do not have access to this ressource',
  NOT_AUTHENTICATED = 'Not authenticated. You must be logged in to perform this action.',
  FORBIDDEN = 'Forbidden. You do not have permission to perform this action.',
  TOKEN_EXPIRED = 'Token expired. Please login again.',
}

export const cookieName = 'rtkn';
export const passwordLength = 8;
