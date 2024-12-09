import store from "@/store";
import { ThemeProvider } from "next-themes";
import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import ThemeDataProvider from "./themeContext";
import '../style/global.css';
import { Toaster } from "@/components/ui/toaster";
interface AppProvidersProps {
    children: ReactNode;
}

const AppProviders: FC<AppProvidersProps> = ({ children }) => {
    return (
        <ThemeProvider attribute="class">
            <ThemeDataProvider>
                <Provider store={store}>
                    {children}
                    <Toaster />
                </Provider>
            </ThemeDataProvider>
        </ThemeProvider>
    );
};

export default AppProviders;
