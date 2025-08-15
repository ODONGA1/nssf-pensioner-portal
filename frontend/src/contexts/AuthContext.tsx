import React, { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/apiService";

// Types
interface Pensioner {
  id: string;
  nssfNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface User {
  id: string;
  username: string;
  role: string;
  pensioner?: Pensioner;
  lastLogin?: string;
  mustChangePassword?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    // Check for stored auth token and validate
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);

            // Optionally verify token with backend
            // const profile = await apiService.getProfile();
            // setUser(profile.data.user);
          } catch (error) {
            console.error("Invalid stored user data:", error);
            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      console.log("🚀 Starting login process for:", username);

      const response = await apiService.login(username, password);
      console.log("📡 API Response received:", response);

      if (response.success && response.data) {
        console.log("✅ Login successful, setting user:", response.data.user);
        setUser(response.data.user);
      } else {
        console.error("❌ Login failed - API returned:", response);
        throw new Error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("💥 Login error:", error);
      throw new Error(
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
