import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface User {
  id: number;
  uuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  googleId?: string;
  provider?: 'local' | 'google';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GoogleLoginRequest {
  credential: string; // JWT token từ Google
}

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  sub: string; // Google ID
}

// Prompt types
export interface Prompt {
  id: number;
  title: string;
  content: string;
  taskType: 'task1' | 'task2';
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  wordCount: number;
  timeLimit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Test types
export interface TestResult {
  id?: number;
  userId?: number;
  promptId?: number;
  testType: 'practice' | 'mock' | 'custom';
  mode: 'preset' | 'custom';
  sampleText?: string;
  userInput: string;
  wpm: number;
  accuracy: number;
  timeSpent: number;
  wordCount: number;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Essay types
export interface Essay {
  id?: number;
  userId?: number;
  testId?: number;
  prompt: string;
  taskType: 'task1' | 'task2';
  essayText: string;
  uploadedImage?: string;
  wordCount: number;
  overallBand?: number;
  taskResponseScore?: number;
  coherenceScore?: number;
  lexicalResourceScore?: number;
  grammarScore?: number;
  feedback?: string;
  isScored: boolean;
  scoredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OCRResult {
  extractedText: string;
  imageUrl: string;
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, clear token
          this.setToken(null);
          // You might want to redirect to login here
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage on initialization
    this.loadToken();
  }

  private loadToken(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.setToken(token);
    }
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  // Auth API
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/login', data);
    const authData = response.data.data;
    this.setToken(authData.token);
    return authData;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const authData = response.data.data;
    this.setToken(authData.token);
    return authData;
  }

  async getProfile(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>('/auth/profile');
    return response.data.data;
  }

  logout(): void {
    this.setToken(null);
  }

  // Prompts API
  async getPrompts(params?: {
    page?: number;
    limit?: number;
    taskType?: 'task1' | 'task2';
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
  }): Promise<PaginatedResponse<Prompt>> {
    const response = await this.client.get<ApiResponse<Prompt[] & { pagination: PaginationMeta }>>('/prompts', { params });
    return {
      data: response.data.data,
      pagination: (response.data.data as any).pagination,
    };
  }

  async getRandomPrompts(count?: number, taskType?: 'task1' | 'task2'): Promise<Prompt[]> {
    const params = new URLSearchParams();
    if (count) params.append('count', count.toString());
    if (taskType) params.append('taskType', taskType);

    const response = await this.client.get<ApiResponse<Prompt[]>>(`/prompts/random?${params}`);
    return response.data.data; 
  }

  async getPrompt(id: number): Promise<Prompt> {
    const response = await this.client.get<ApiResponse<Prompt>>(`/prompts/${id}`);
    return response.data.data;
  }

  // Tests API
  async submitTest(testData: Omit<TestResult, 'id' | 'createdAt' | 'updatedAt'>): Promise<TestResult> {
    const response = await this.client.post<ApiResponse<TestResult>>('/tests', testData);
    return response.data.data;
  }

  async getUserTests(params?: {
    page?: number;
    limit?: number;
    testType?: 'practice' | 'mock' | 'custom';
    mode?: 'preset' | 'custom';
  }): Promise<PaginatedResponse<TestResult>> {
    const response = await this.client.get<ApiResponse<TestResult[] & { pagination: PaginationMeta }>>('/tests', { params });
    return {
      data: response.data.data,
      pagination: (response.data.data as any).pagination,
    };
  }

  async getTest(id: number): Promise<TestResult> {
    const response = await this.client.get<ApiResponse<TestResult>>(`/tests/${id}`);
    return response.data.data;
  }

  async getTestStats(): Promise<any[]> {
    const response = await this.client.get<ApiResponse<any[]>>('/tests/stats');
    return response.data.data;
  }

  async deleteTest(id: number): Promise<void> {
    await this.client.delete(`/tests/${id}`);
  }

  // Essays API
  async uploadEssayImage(file: File): Promise<OCRResult> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await this.client.post<ApiResponse<OCRResult>>('/essays/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  async submitEssay(essayData: Omit<Essay, 'id' | 'createdAt' | 'updatedAt'>): Promise<Essay> {
    const response = await this.client.post<ApiResponse<Essay>>('/essays', essayData);
    return response.data.data;
  }

  async scoreEssay(essayId: number): Promise<Essay> {
    const response = await this.client.post<ApiResponse<Essay>>(`/essays/${essayId}/score`);
    return response.data.data;
  }

  async getUserEssays(params?: {
    page?: number;
    limit?: number;
    taskType?: 'task1' | 'task2';
    isScored?: boolean;
  }): Promise<PaginatedResponse<Essay>> {
    const response = await this.client.get<ApiResponse<Essay[] & { pagination: PaginationMeta }>>('/essays', { params });
    return {
      data: response.data.data,
      pagination: (response.data.data as any).pagination,
    };
  }

  async getEssay(id: number): Promise<Essay> {
    const response = await this.client.get<ApiResponse<Essay>>(`/essays/${id}`);
    return response.data.data;
  }

  async getEssayStats(): Promise<any[]> {
    const response = await this.client.get<ApiResponse<any[]>>('/essays/stats');
    return response.data.data;
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();

export default apiClient;
export { ApiClient };