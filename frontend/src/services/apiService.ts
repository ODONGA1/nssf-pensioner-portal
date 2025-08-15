// API configuration and utilities
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3004/api/v1";

class ApiService {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  // Get auth token from localStorage
  private getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  // Get headers with auth token
  private getHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      ...(this.defaultHeaders as Record<string, string>),
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(includeAuth);

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(username: string, password: string) {
    console.log("🔐 API Service: Starting login request...");
    console.log("📍 API URL:", `${this.baseURL}/auth/login`);
    console.log("👤 Username:", username);

    const response = await this.request<{
      success: boolean;
      message: string;
      data: {
        user: {
          id: string;
          username: string;
          role: string;
          pensioner?: {
            id: string;
            nssfNumber: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
          };
          lastLogin: string;
          mustChangePassword: boolean;
        };
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
      };
    }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ username, password }),
      },
      false
    );

    console.log("📨 Raw API Response:", response);

    // Store tokens if login successful
    if (response.success && response.data) {
      console.log("💾 Storing tokens in localStorage...");
      localStorage.setItem("authToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("✅ Tokens stored successfully");
    } else {
      console.error("❌ Login response was not successful:", response);
    }

    return response;
  }

  async logout() {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      await this.request("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await this.request<{
      success: boolean;
      data: {
        accessToken: string;
        expiresIn: string;
      };
    }>(
      "/auth/refresh",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      },
      false
    );

    if (response.success && response.data) {
      localStorage.setItem("authToken", response.data.accessToken);
    }

    return response;
  }

  // Password reset endpoints
  async initiatePasswordReset(nssfNumber: string) {
    return this.request(
      "/auth/forgot-password/initiate",
      {
        method: "POST",
        body: JSON.stringify({ nssfNumber }),
      },
      false
    );
  }

  async sendVerificationCode(sessionToken: string, method: "email" | "sms") {
    return this.request(
      "/auth/forgot-password/send-code",
      {
        method: "POST",
        body: JSON.stringify({ sessionToken, method }),
      },
      false
    );
  }

  async verifyCode(sessionToken: string, verificationCode: string) {
    return this.request(
      "/auth/forgot-password/verify-code",
      {
        method: "POST",
        body: JSON.stringify({ sessionToken, verificationCode }),
      },
      false
    );
  }

  async resetPassword(resetToken: string, newPassword: string) {
    return this.request(
      "/auth/forgot-password/reset",
      {
        method: "POST",
        body: JSON.stringify({ resetToken, newPassword }),
      },
      false
    );
  }

  // User profile endpoints
  async getProfile() {
    return this.request("/users/profile");
  }

  async updateProfile(profileData: any) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Pensioner data endpoints
  async getPensionerData(pensionerId: string) {
    return this.request(`/pensioners/${pensionerId}`);
  }

  async getPensionBenefits(pensionerId: string) {
    return this.request(`/pensioners/${pensionerId}/benefits`);
  }

  async getPensionPayments(
    pensionerId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/pensioners/${pensionerId}/payments${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return this.request(endpoint);
  }

  // Voluntary savings endpoints
  async getVoluntarySavingsAccounts(pensionerId: string) {
    return this.request(`/pensioners/${pensionerId}/savings/accounts`);
  }

  async getSavingsTransactions(
    accountId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/savings/accounts/${accountId}/transactions${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return this.request(endpoint);
  }

  // Mid-term access endpoints
  async getMidtermApplications(pensionerId: string) {
    return this.request(`/pensioners/${pensionerId}/midterm-access`);
  }

  async createMidtermApplication(pensionerId: string, applicationData: any) {
    return this.request(`/pensioners/${pensionerId}/midterm-access`, {
      method: "POST",
      body: JSON.stringify(applicationData),
    });
  }

  async getMidtermApplication(applicationId: string) {
    return this.request(`/midterm-access/${applicationId}`);
  }

  // Generic CRUD operations
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
