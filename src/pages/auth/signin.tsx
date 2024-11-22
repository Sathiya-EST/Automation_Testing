import { useState } from "react";
import { LoginForm } from "./components/signinContainer";
import { useSignInMutation } from "@/store/services/auth/login";
import { storeToken } from "@/utils/securels";
import { Button } from "@/components/ui/button";
import { useSignOutMutation } from "@/store/services/auth/logout";
import AppLayout from "@/components/Applayout";

interface SignInData {
    userId: string;
    password: string;
}

interface SignInResponse {
    access_token: string;
    refresh_token: string;
    user_role: string;
    user_id: string;
    user_name: string;
}

export default function LoginPage() {
    const [signIn] = useSignInMutation<SignInResponse>();
    const [signOut] = useSignOutMutation();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const handleLogin = async (data: SignInData) => {
        try {
            const result = await signIn(data).unwrap();
            storeToken(result.access_token, result.refresh_token);
            setErrorMessage(null);
        } catch (err) {
            console.error('Login failed:', err);
            setErrorMessage('Login failed. Please check your credentials and try again.');
        }
    };

    const handleLogout = async () => {

        try {
            await signOut({}).unwrap();

            console.log('User logged out successfully');


        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">

            {/* <AppLayout /> */}
            {/* {isLoading && <div className="loader">Loading...</div>} */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <LoginForm
                onSubmit={handleLogin}
                showCreateAccount={false}
            />
            <Button onClick={handleLogout} >Logout</Button>
        </div>
    );
}