// Core application types
export interface User {
  id: string;
  email?: string;
  name?: string;
}

export interface TestResult {
  id: string;
  userId?: string;
  type: 'typing' | 'mock-test';
  score: number;
  wpm?: number;
  accuracy?: number;
  timeSpent: number;
  wordCount?: number;
  text?: string;
  createdAt: Date;
}

// Typing test types
export interface TypingStats {
  wpm: number;
  accuracy: number;
  time: number;
  completeness: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

export interface TypingSession {
  startTime: number | null;
  currentTime: number;
  userInput: string;
  wordCount: 10 | 25 | 50 | 100;
  includePunctuation: boolean;
  includeNumbers: boolean;
  zenMode: boolean;
}

// Mock test types
export interface MockTestSession {
  essay: string;
  timeLeft: number;
  isStarted: boolean;
  wordCount: number;
}

export interface IELTSBandScore {
  overall: number;
  taskResponse: number;
  coherence: number;
  lexicalResource: number;
  grammar: number;
}

// Component props types
export interface AccordionSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

// Form types
export interface CustomPromptForm {
  text: string;
  wordCount: number;
  includePunctuation: boolean;
  includeNumbers: boolean;
}

// API response types (for future expansion)
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Navigation types
export type RoutePath = '/' | '/practice' | '/mock-test' | '/custom-prompt' | '/report';

// Theme types (if using dark/light theme)
export type Theme = 'light' | 'dark' | 'system';

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';