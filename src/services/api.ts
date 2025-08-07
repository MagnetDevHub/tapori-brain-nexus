import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Request interceptor for loading state
let requestCount = 0;

api.interceptors.request.use((config) => {
  requestCount++;
  return config;
});

api.interceptors.response.use(
  (response) => {
    requestCount--;
    return response;
  },
  (error) => {
    requestCount--;
    return Promise.reject(error);
  }
);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  attachments?: File[];
}

export interface ChatResponse {
  agent: string;
  response: string;
  emotions?: string[];
}

export interface AdminConfig {
  model: string;
  temperature: number;
  streaming: boolean;
  agent_switching: boolean;
  [key: string]: any;
}

export interface AdminStats {
  environment: string;
  model_info: {
    name: string;
    version: string;
    parameters?: string;
  };
  uptime: string;
  memory_usage?: string;
  cpu_usage?: string;
  active_sessions: number;
}

export interface FeatureFlags {
  [key: string]: boolean;
}

class ChatAPI {
  async sendMessage(message: string, attachments?: File[]): Promise<ChatResponse> {
    const formData = new FormData();
    formData.append('message', message);
    
    if (attachments) {
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
    }

    const response = await api.post<ChatResponse>('/chat/send', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async sendVoice(audioFile: File): Promise<{ ok: boolean; message?: string }> {
    const formData = new FormData();
    formData.append('file', audioFile);

    const response = await api.post('/chat/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async getAdminConfig(): Promise<AdminConfig> {
    const response = await api.get<AdminConfig>('/admin/config');
    return response.data;
  }

  async updateAdminConfig(key: string, value: any): Promise<{ ok: boolean }> {
    const response = await api.post('/admin/config', { key, value });
    return response.data;
  }

  async getAdminStats(): Promise<AdminStats> {
    const response = await api.get<AdminStats>('/admin/stats');
    return response.data;
  }

  async getFeatureFlags(): Promise<FeatureFlags> {
    const response = await api.get<FeatureFlags>('/admin/features');
    return response.data;
  }

  async updateFeatureFlag(key: string, value: boolean): Promise<{ ok: boolean }> {
    const response = await api.post('/admin/features', { key, value });
    return response.data;
  }
}

export const chatAPI = new ChatAPI();
export { api };