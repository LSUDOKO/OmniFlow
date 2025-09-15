"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeColor = 'gold' | 'blue' | 'purple' | 'green';
export type ThemeMode = 'light' | 'dark';

interface ThemeSettings {
  mode: ThemeMode;
  color: ThemeColor;
  soundEnabled: boolean;
  animations: boolean;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateTheme: (updates: Partial<ThemeSettings>) => void;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  setThemeColor: (color: ThemeColor) => void;
  playSound: (soundType: 'click' | 'success' | 'error' | 'notification') => void;
}

const defaultSettings: ThemeSettings = {
  mode: 'dark',
  color: 'gold',
  soundEnabled: true,
  animations: true,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Simple sound generation
const playBeep = (frequency: number, duration: number) => {
  if (typeof window === 'undefined') return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.log('Audio not supported');
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('omniflow-theme-settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsed });
        } catch (error) {
          console.error('Failed to parse theme settings:', error);
        }
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omniflow-theme-settings', JSON.stringify(settings));
      
      // Apply theme to document
      const root = document.documentElement;
      root.setAttribute('data-theme', settings.mode);
      root.setAttribute('data-color', settings.color);
    }
  }, [settings]);

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const toggleDarkMode = () => {
    const newMode = settings.mode === 'dark' ? 'light' : 'dark';
    updateTheme({ mode: newMode });
    if (settings.soundEnabled) {
      playBeep(newMode === 'dark' ? 200 : 400, 0.1);
    }
  };

  const toggleSound = () => {
    const newSoundEnabled = !settings.soundEnabled;
    updateTheme({ soundEnabled: newSoundEnabled });
    if (newSoundEnabled) {
      playBeep(600, 0.1);
    }
  };

  const setThemeColor = (color: ThemeColor) => {
    updateTheme({ color });
    if (settings.soundEnabled) {
      const frequencies = { gold: 300, blue: 350, purple: 400, green: 450 };
      playBeep(frequencies[color], 0.1);
    }
  };

  const playSound = (soundType: 'click' | 'success' | 'error' | 'notification') => {
    if (!settings.soundEnabled) return;
    
    const soundMap = {
      click: { frequency: 800, duration: 0.05 },
      success: { frequency: 600, duration: 0.2 },
      error: { frequency: 200, duration: 0.3 },
      notification: { frequency: 500, duration: 0.15 }
    };
    
    const sound = soundMap[soundType];
    playBeep(sound.frequency, sound.duration);
  };

  const value: ThemeContextType = {
    settings,
    updateTheme,
    toggleDarkMode,
    toggleSound,
    setThemeColor,
    playSound,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
