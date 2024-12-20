import { useState } from "react";
import { LoginForm } from "./components/signinContainer";
import { useSignInMutation } from "@/store/services/auth/login";
import { useNavigate } from "react-router-dom";
import { UI_ROUTES } from "@/constants/routes";
import { setTokens } from "@/store/slice/authSlice";
import { useDispatch } from "react-redux";
import { useLoginRedirect } from "@/hooks/useLoginRedirect";
import Spinner from "@/components/shared/Spinner";

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

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [signIn] = useSignInMutation<SignInResponse>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { isAuthenticated, loading } = useLoginRedirect();

    if (loading) {
        return <Spinner />;
    }

    if (isAuthenticated) {
        return null;
    }
    const handleLogin = async (data: SignInData) => {
        try {
            const result = await signIn(data).unwrap();
            dispatch(setTokens({
                accessToken: result.access_token,
                refreshToken: result.refresh_token,
                userName: result.user_name,
                userRole: result.user_role
            }));
            setErrorMessage(null);
            navigate(UI_ROUTES.MASTER);
        } catch (err) {
            console.error('Login failed:', err);
            setErrorMessage('Login failed. Please check your credentials and try again.');

        }
    };
    const handleForgotPassword = () => {
        navigate(UI_ROUTES.FORGOT_PASSWORD)
    }
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
            <LoginForm
                onSubmit={handleLogin}
                showCreateAccount={false}
                isError={!!errorMessage}
                handleForgotPassword={handleForgotPassword}
            />
        </div>
    );
};

export default LoginPage;
