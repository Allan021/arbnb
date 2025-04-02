import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "@/lib/api";

// Interfaces
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  success: boolean;
  data?: User;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<AuthResponse>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userFromStorage = authService.getCurrentUser();
    if (userFromStorage) {
      setUser(userFromStorage);
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      return { success: true, data: userData };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const userData = await authService.register(name, email, password);
      setUser(userData);
      return { success: true, data: userData };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al registrarse",
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (
    userData: Partial<User>
  ): Promise<AuthResponse> => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      return { success: true, data: updatedUser };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Error al actualizar perfil",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export default AuthContext;
