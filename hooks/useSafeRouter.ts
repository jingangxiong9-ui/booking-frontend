import { useRouter, useLocalSearchParams as useRNLocalSearchParams } from '@react-navigation/native';
import { useCallback } from 'react';

export function useSafeRouter() {
  const router = useRouter();

  const navigate = useCallback((path: string, params?: Record<string, any>) => {
    // React Navigation 使用 name 而不是 path
    // 路由名称与 App.tsx 中定义的一致
    if (params) {
      router.navigate({ pathName: path, params });
    } else {
      router.navigate(path);
    }
  }, [router]);

  return {
    push: navigate,
    replace: router.replace,
    back: router.back,
    navigate: router.navigate,
  };
}

export function useSafeSearchParams<T extends Record<string, any>>() {
  const params = useRNLocalSearchParams<T>();
  return params;
}

// Re-export Stack for compatibility
export const Stack = {
  Screen: () => null,
};
