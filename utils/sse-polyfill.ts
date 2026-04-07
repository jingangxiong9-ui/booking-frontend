// Web 端使用原生 EventSource，React Native 使用 react-native-sse

// Web 环境
const isWeb = typeof window !== 'undefined' && typeof window.navigator !== 'undefined';

interface SSECallbacks {
  onMessage?: (data: string) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
}

export class SSClient {
  private eventSource: any = null;
  private callbacks: SSECallbacks;

  constructor(url: string, callbacks: SSECallbacks) {
    this.callbacks = callbacks;

    if (isWeb) {
      // Web 环境：使用原生 EventSource
      this.eventSource = new EventSource(url);
      this.eventSource.onopen = () => callbacks.onOpen?.();
      this.eventSource.onmessage = (event: any) => callbacks.onMessage?.(event.data);
      this.eventSource.onerror = (error: Event) => callbacks.onError?.(error);
    }
  }

  close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
