export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
  hover: string;
  selected: string;
};

export const themes: Record<string, ThemeColors> = {
  classic: {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-100',
    accent: 'bg-indigo-600',
    background: 'bg-gray-100',
    surface: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-50',
    selected: 'bg-blue-100'
  },
  dark: {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-900',
    accent: 'bg-indigo-500',
    background: 'bg-gray-900',
    surface: 'bg-gray-800',
    text: 'text-white',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700',
    selected: 'bg-gray-700'
  },
  forest: {
    primary: 'bg-green-600',
    secondary: 'bg-emerald-100',
    accent: 'bg-lime-600',
    background: 'bg-emerald-50',
    surface: 'bg-white',
    text: 'text-green-900',
    border: 'border-green-200',
    hover: 'hover:bg-green-50',
    selected: 'bg-green-100'
  },
  desert: {
    primary: 'bg-amber-600',
    secondary: 'bg-orange-100',
    accent: 'bg-red-600',
    background: 'bg-orange-50',
    surface: 'bg-white',
    text: 'text-amber-900',
    border: 'border-amber-200',
    hover: 'hover:bg-amber-50',
    selected: 'bg-amber-100'
  },
  ocean: {
    primary: 'bg-cyan-600',
    secondary: 'bg-sky-100',
    accent: 'bg-blue-600',
    background: 'bg-sky-50',
    surface: 'bg-white',
    text: 'text-cyan-900',
    border: 'border-cyan-200',
    hover: 'hover:bg-cyan-50',
    selected: 'bg-cyan-100'
  }
};