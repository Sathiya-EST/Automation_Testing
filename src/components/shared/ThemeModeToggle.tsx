import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { Sun, Moon } from 'lucide-react';

const ThemeModeToggle = () => {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = (selectedTheme: 'light' | 'dark') => {
    setTheme(selectedTheme);
  };

  const icons: Record<'light' | 'dark', JSX.Element> = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
  };

  return (
    <div className="flex items-center gap-2">
      {['light', 'dark'].map((mode) => (
        <Button
          key={mode}
          variant={theme === mode ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleThemeChange(mode as 'light' | 'dark')}
          className={`flex items-center gap-2 capitalize ${theme === mode ? 'bg-primary text-white' : ''}`}
        >
          {icons[mode as 'light' | 'dark']}
          {mode}
        </Button>
      ))}
    </div>
  );
};

export default ThemeModeToggle;
