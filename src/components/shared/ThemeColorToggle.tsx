import { useThemeContext } from "@/contexts/themeContext"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { ThemeColors } from "@/types/style/theme";

const availableThemeColors = [
    { name: 'LightBlue', light: "bg-blue-400", dark: "bg-blue-600" },
    { name: 'Zinc', light: "bg-zinc-900", dark: "bg-zinc-700" },
    { name: 'Rose', light: "bg-rose-900", dark: "bg-rose-700" },
    { name: 'Blue', light: "bg-blue-900", dark: "bg-blue-700" },
    { name: 'Green', light: "bg-green-900", dark: "bg-green-700" },
    { name: 'Orange', light: "bg-orange-900", dark: "bg-orange-700" },
    { name: 'Red', light: "bg-red-900", dark: "bg-red-700" },
    { name: 'Yellow', light: "bg-yellow-900", dark: "bg-yellow-700" },
    { name: 'Violet', light: "bg-violet-900", dark: "bg-violet-700" },
]
export function ThemeColorToggle() {
    const { themeColor, setThemeColor } = useThemeContext();
    const { theme } = useTheme();

    const createSelectItems = () => {
        return availableThemeColors.map(({ name, light, dark }) => (
            <SelectItem key={name} value={name}>
                <div className="flex item-center space-x-3">
                    <div
                        className={cn(
                            "rounded-full",
                            "w-[20px]",
                            "h-[20px]",
                            theme === "light" ? light : dark,
                        )}
                    ></div>
                    <div className="text-sm">{name}</div>
                </div>
            </SelectItem>
        ));
    };

    return (
        <Select
            onValueChange={(value) => setThemeColor(value as ThemeColors)}
            defaultValue={themeColor}
        >
            <SelectTrigger className="w-[180px] ring-offset-transparent focus:ring-transparent">
                <SelectValue placeholder="Select Color" />
            </SelectTrigger>
            <SelectContent className="border-muted">
                {createSelectItems()}
            </SelectContent>
        </Select>
    );
}