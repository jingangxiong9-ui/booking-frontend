import { useRouter as useExpoRouter, useLocalSearchParams, Stack, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect, useCallback } from 'react';

export function useSafeRouter() {
  const router = useExpoRouter();
  const segments = useSegments();
  const rootState = useRootNavigationState();

  const navigate = useCallback((path: string, params?: Record<string, any>) => {
    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      router.push(`${path}?${queryString}`);
    } else {
      router.push(path);
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
  const params = useLocalSearchParams();
  return params as T;
}

export { Stack };
