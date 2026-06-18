import type {
  ApiEnvelope,
  ChangePasswordPayload,
  DashboardChartData,
  DashboardOverviewData,
  InquiryListResponse,
  UpdateProfilePayload,
  UserProfile,
} from "@/types/dashboard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function parseResponse<T>(response: Response): Promise<ApiEnvelope<T>> {
  const data = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  if (!data) {
    throw new Error("Invalid response from server");
  }

  return data;
}

async function apiRequest<T>(
  path: string,
  options: {
    token?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: BodyInit | null;
    headers?: HeadersInit;
  } = {}
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body ?? undefined,
  });

  return parseResponse<T>(response);
}

export async function fetchDashboardOverview(token: string) {
  return apiRequest<DashboardOverviewData>("/dashboard/overview", { token });
}

export async function fetchDashboardChart(token: string, year?: number) {
  const query = year ? `?year=${encodeURIComponent(String(year))}` : "";
  return apiRequest<DashboardChartData>(`/dashboard/chart${query}`, { token });
}

export async function fetchMyProfile(token: string) {
  return apiRequest<UserProfile>("/user/profile", { token });
}

export async function updateMyProfile(token: string, payload: UpdateProfilePayload | FormData) {
  const isFormData = payload instanceof FormData;

  return apiRequest<UserProfile>("/user/profile", {
    token,
    method: "PUT",
    body: isFormData ? payload : JSON.stringify(payload),
    headers: isFormData
      ? undefined
      : {
          "Content-Type": "application/json",
        },
  });
}

export async function changeMyPassword(token: string, payload: ChangePasswordPayload) {
  return apiRequest<{ message: string }>("/auth/change-password", {
    token,
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function fetchRecentInquiries(token: string, params?: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  return apiRequest<InquiryListResponse>(`/inquiry${query ? `?${query}` : ""}`, {
    token,
  });
}
