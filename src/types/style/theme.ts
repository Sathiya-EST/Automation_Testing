export type ThemeColors = "Zinc" | "Red" | "Rose" | "Orange" | "Green" | "Blue" | "Yellow" | "Violet";

export interface ThemeColorStateParams{
    themeColor:ThemeColors;
    setThemeColor:React.Dispatch<React.SetStateAction<ThemeColors>>;
}
