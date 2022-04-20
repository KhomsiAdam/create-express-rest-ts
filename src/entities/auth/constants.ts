export enum Roles {
  ADMIN = 'Admin',
  USER = 'User',
}

export enum SuccessMessages {
  REGISTER_SUCCESS = 'Account created successfully.',
  REFRESH_SUCCESS = 'Refresh token updated successfully.',
  LOGGED_IN = 'Logged in successfully.',
  LOGGED_OUT = 'Logged out successfully.',
  NOT_LOGGED_IN = 'Not logged in.',
}

export enum ErrorMessages {
  LOGIN_ERROR = 'Unable to login.',
  REGISTER_ERROR = 'User already exists with this email.',
  NOT_AUTHORIZED = 'Not authorized.',
  NOT_AUTHENTICATED = 'Not authenticated.',
  FORBIDDEN = 'Forbidden.',
  TOKEN_EXPIRED = 'Token expired.',
  NOT_ALLOWED = 'Not allowed.',
  REQUIRED_FIELDS_MISSING = 'Required fields missing.',
}

export const cookieName = 'rtkn';
