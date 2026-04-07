import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adminLogin } from '@/utils/api';

interface AuthContextType {
  isAuthenticated: boolean;
  sessionId: string | null;
  isFirstLogin: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = '@admin_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    // 从存储加载会话
    AsyncStorage.getItem(SESSION_KEY).then((stored) => {
      if (stored) {
        const { sessionId, isFirstLogin } = JSON.parse(stored);
        setSessionId(sessionId);
        setIsFirstLogin(isFirstLogin);
      }
    });
  }, []);

  const login = async (phone: string, password: string) => {
    const result = await adminLogin(phone, password);
    setSessionId(result.sessionId);
    setIsFirstLogin(result.isFirstLogin);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({
      sessionId: result.sessionId,
      isFirstLogin: result.isFirstLogin,
    }));
  };

  const logout = async () => {
    setSessionId(null);
    setIsFirstLogin(false);
    await AsyncStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!sessionId,
      sessionId,
      isFirstLogin,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
