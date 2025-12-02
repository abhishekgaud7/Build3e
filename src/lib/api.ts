const envBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
const BASE_URL = envBase && envBase.length > 0 ? envBase.replace(/\/$/, "") : "";

type ApiResponse<T> = { success: boolean; data?: T; error?: { message: string } };

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = `${BASE_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch (e) {
    const reason = (e as Error)?.message || "Unknown";
    throw new Error(`Network error calling ${url}: ${reason}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.text();
      detail = body?.slice(0, 200) || "";
    } catch {}
    throw new Error(`Request failed ${res.status} ${res.statusText} at ${url}${detail ? `: ${detail}` : ""}`);
  }
  if (!contentType.includes("application/json")) {
    throw new Error(`Unexpected response content-type from ${url}. Set VITE_API_BASE_URL to your backend origin.`);
  }
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) {
    const msg = json.error?.message || "Request failed";
    throw new Error(msg);
  }
  return json.data as T;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: any; token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (payload: { name: string; email: string; phone: string; role: "buyer" | "seller"; password: string; confirmPassword?: string }) =>
      request<{ user: any; token: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          role: payload.role.toUpperCase(),
          confirmPassword: payload.confirmPassword ?? payload.password,
        }),
      }),
    me: () => request<{ user: any }>("/api/auth/me", { method: "GET" }),
    updateProfile: (payload: { name?: string; email?: string; phone?: string }) =>
      request<{ user: any }>("/api/auth/profile", { method: "PUT", body: JSON.stringify(payload) }),
  },
  products: {
    list: (query?: { search?: string; categorySlug?: string; page?: number; limit?: number }) => {
      const params = new URLSearchParams();
      if (query?.search) params.set("search", query.search);
      if (query?.categorySlug) params.set("categorySlug", query.categorySlug);
      if (query?.page) params.set("page", String(query.page));
      if (query?.limit) params.set("limit", String(query.limit));
      const qs = params.toString() ? `?${params.toString()}` : "";
      return request<{ products: any[]; page: number; limit: number; total: number }>(`/api/products${qs}`, { method: "GET" });
    },
    get: (id: string) => request<{ product: any }>(`/api/products/${id}`, { method: "GET" }),
    categories: (page = 1, limit = 20) => request<{ categories: any[]; page: number; limit: number; total: number }>(`/api/products/categories?page=${page}&limit=${limit}`, { method: "GET" }),
    categoryBySlug: (slug: string) => request<{ category: any }>(`/api/products/categories/${slug}`, { method: "GET" }),
  },
  orders: {
    list: () => request<{ orders: any[] }>("/api/orders", { method: "GET" }),
    get: (id: string) => request<{ order: any }>(`/api/orders/${id}`, { method: "GET" }),
    create: (payload: { items: Array<{ productId: string; quantity: number }>; addressId: string }) =>
      request<{ order: any }>("/api/orders", { method: "POST", body: JSON.stringify(payload) }),
  },
  addresses: {
    list: () => request<{ addresses: any[] }>("/api/addresses", { method: "GET" }),
    create: (payload: { label: string; line1: string; line2?: string; city: string; state: string; pincode: string; isDefault?: boolean }) =>
      request<{ address: any }>("/api/addresses", { method: "POST", body: JSON.stringify(payload) }),
    delete: (id: string) => request<{ success: boolean }>(`/api/addresses/${id}`, { method: "DELETE" }),
  },
};
