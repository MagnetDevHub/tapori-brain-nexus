import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  systemTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useTheme = create<ThemeStore>((set, get) => ({
  theme: 'system',
  systemTheme: 'light',

  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);
    applyTheme(theme, get().systemTheme);
  },

  toggleTheme: () => {
    const current = get().getEffectiveTheme();
    const newTheme = current === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  getEffectiveTheme: () => {
    const { theme, systemTheme } = get();
    return theme === 'system' ? systemTheme : theme;
  },
}));

function applyTheme(theme: Theme, systemTheme: 'light' | 'dark') {
  const root = document.documentElement;
  const effectiveTheme = theme === 'system' ? systemTheme : theme;
  
  if (effectiveTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

// Initialize theme on load
export function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') as Theme || 'system';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  
  useTheme.setState({ theme: savedTheme, systemTheme });
  applyTheme(savedTheme, systemTheme);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const newSystemTheme = e.matches ? 'dark' : 'light';
    useTheme.setState({ systemTheme: newSystemTheme });
    applyTheme(useTheme.getState().theme, newSystemTheme);
  });
}