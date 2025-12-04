import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Application constants
export const APP_CONFIG = {
  name: 'Modern IELTS Typing Interface',
  version: '0.1.0',
  description: 'IELTS Writing and Typing Practice Platform'
} as const;

// Typing test configurations
export const TYPING_CONFIG = {
  wordCounts: [10, 25, 50, 100] as const,
  defaultWordCount: 25 as const,
  wpmTargets: {
    beginner: 20,
    intermediate: 40,
    advanced: 60
  }
} as const;

// IELTS scoring bands
export const IELTS_BANDS = {
  min: 0,
  max: 9,
  bands: [0, 1, 2, 3, 4, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9]
} as const;

// Mock test duration (in minutes)
export const MOCK_TEST_DURATION = 60;

// API endpoints (if needed in future)
export const API_ENDPOINTS = {
  // Placeholder for future API integration
} as const;

// Utility for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format time from seconds to MM:SS or HH:MM:SS
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Calculate words per minute
export function calculateWPM(characters: number, timeInSeconds: number): number {
  if (timeInSeconds === 0) return 0;
  // Standard: 5 characters = 1 word
  const words = characters / 5;
  const minutes = timeInSeconds / 60;
  return Math.round(words / minutes);
}

// Calculate accuracy percentage
export function calculateAccuracy(correctCharacters: number, totalCharacters: number): number {
  if (totalCharacters === 0) return 100;
  return Math.round((correctCharacters / totalCharacters) * 100);
}

// Format file size in human readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Check if string is valid email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Capitalize first letter of string
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Truncate text to specified length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}