export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface BackendUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  status?: string;
  profilePicture?: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  status?: string;
  profilePicture?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: BackendUser;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}
