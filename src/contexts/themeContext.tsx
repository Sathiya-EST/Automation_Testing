import setGlobalColorTheme from "@/lib/theme-color"
import { ThemeColors, ThemeColorStateParams } from "@/types/style/theme"
import { ThemeProviderProps, useTheme } from "next-themes"
import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext<ThemeColorStateParams>(
    {} as ThemeColorStateParams,
);

export default function ThemeDataProvider({
    children,
}: ThemeProviderProps) {
    const getSavedThemeColor = () => {
        try {
            return (localStorage.getItem("themeColor") as ThemeColors) || "Zinc";
        } catch (error) {
            "Zinc" as ThemeColors;
        }
    };

    const [themeColor, setThemeColor] = useState<ThemeColors>(
        getSavedThemeColor() as ThemeColors || 'Blue',
    );
    const [isMounted, setIsMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        localStorage.setItem("themeColor", themeColor);
        setGlobalColorTheme(theme as "light" | "dark", themeColor);

        if (!isMounted) {
            setIsMounted(true);
        }
    }, [themeColor, theme]);

    if (!isMounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    return useContext(ThemeContext);
}


