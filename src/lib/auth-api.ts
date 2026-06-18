import type {
  ApiResponse,
  AuthUser,
  BackendUser,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "@/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function mapBackendUser(user: BackendUser): AuthUser {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
    profilePicture: user.profilePicture,
  };
}

export function normalizeAuthUser(user: BackendUser | AuthUser) {
  if ("_id" in user) {
    return mapBackendUser(user);
  }

  return user;
}

async function postAuth<TResponse>(path: string, payload: unknown) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as ApiResponse<TResponse> | null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  if (!data) {
    throw new Error("Invalid response from server");
  }

  return data;
}

export async function registerUser(payload: RegisterPayload) {
  const response = await postAuth<BackendUser>("/auth/register", payload);
  return response;
}

export async function loginUser(payload: LoginPayload) {
  const response = await postAuth<LoginResponse>("/auth/login", payload);
  return response;
}

export async function sendForgotPasswordOtp(payload: ForgotPasswordPayload) {
  const response = await postAuth<{ message: string }>("/auth/forgot-password", payload);
  return response;
}

export async function verifyOtp(payload: VerifyOtpPayload) {
  const response = await postAuth<{ message: string }>("/auth/verify", payload);
  return response;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await postAuth<{ message: string }>("/auth/reset-password", payload);
  return response;
}
