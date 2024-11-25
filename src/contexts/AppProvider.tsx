import store from "@/store";
import { ThemeProvider } from "next-themes";
import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import ThemeDataProvider from "./themeContext";
import '../style/global.css';
interface AppProvidersProps {
    children: ReactNode;
}

const AppProviders: FC<AppProvidersProps> = ({ children }) => {
    return (
        <ThemeProvider attribute="class">
            <ThemeDataProvider>
                <Provider store={store}>
                    {children}
                </Provider>
            </ThemeDataProvider>
        </ThemeProvider>
    );
};

export default AppProviders;
