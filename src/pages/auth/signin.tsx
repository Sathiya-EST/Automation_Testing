import { useState } from "react";
import { LoginForm } from "./components/signinContainer";
import { useSignInMutation } from "@/store/services/auth/login";
import { storeToken } from "@/utils/securels";

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

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
            {/* {isLoading && <div className="loader">Loading...</div>} */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <LoginForm
                onSubmit={handleLogin}
                showCreateAccount={false}
            />
        </div>
    );
}