import { useState, useEffect, useCallback } from 'react';
import { TypingStats } from '../types';

export function useTypingStats() {
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    time: 0,
    completeness: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0
  });

  const calculateStats = useCallback((
    userInput: string,
    targetText: string,
    startTime: number | null,
    currentTime: number
  ) => {
    if (!startTime || !targetText) return;

    const timeInSeconds = (currentTime - startTime) / 1000;
    const targetChars = targetText.length;
    const inputChars = userInput.length;

    // Calculate correct characters
    let correctChars = 0;
    let incorrectChars = 0;

    for (let i = 0; i < Math.min(inputChars, targetChars); i++) {
      if (userInput[i] === targetText[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    // Calculate completeness (percentage of target text completed)
    const completeness = Math.min((inputChars / targetChars) * 100, 100);

    // Calculate WPM (words per minute)
    // Standard: 5 characters = 1 word
    const wordsTyped = correctChars / 5;
    const minutes = timeInSeconds / 60;
    const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;

    // Calculate accuracy
    const totalAttemptedChars = correctChars + incorrectChars;
    const accuracy = totalAttemptedChars > 0 ? Math.round((correctChars / totalAttemptedChars) * 100) : 100;

    setStats({
      wpm,
      accuracy,
      time: Math.round(timeInSeconds),
      completeness: Math.round(completeness),
      correctChars,
      incorrectChars,
      totalChars: targetChars
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats({
      wpm: 0,
      accuracy: 0,
      time: 0,
      completeness: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0
    });
  }, []);

  return {
    stats,
    calculateStats,
    resetStats
  };
}