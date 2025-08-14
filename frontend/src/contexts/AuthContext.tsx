import React, { createContext, useContext, useState, useEffect } from "react";

// Types
interface User {
  id: string;
  username: string;
  role: string;
  pensionerId?: string;
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
        if (token) {
          // Validate token with API (placeholder)
          console.log("Validating token...");
          // setUser(validatedUser);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("authToken");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      // API call placeholder
      console.log("Logging in:", username, password);

      // Mock user for development
      const mockUser: User = {
        id: "1",
        username,
        role: "PENSIONER",
        pensionerId: "pension-1",
      };

      setUser(mockUser);
      localStorage.setItem("authToken", "mock-token");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("authToken");
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
