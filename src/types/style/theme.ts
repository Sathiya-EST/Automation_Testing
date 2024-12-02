export type ThemeColors = "Zinc" | "Red" | "Rose" | "Orange" | "Green" | "Blue" | "Yellow" | "Violet"|"LightBlue";

export interface ThemeColorStateParams{
    themeColor:ThemeColors;
    setThemeColor:React.Dispatch<React.SetStateAction<ThemeColors>>;
}
