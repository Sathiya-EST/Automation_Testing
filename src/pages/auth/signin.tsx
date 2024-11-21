import { LoginForm } from "./components/signinContainer";

export default function LoginPage() {
    const handleLogin = async (data: { userId: string; password: string }) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Login attempted with:', data);
    };

    return (
        <div className="flex items-center justify-center min-h-screen  p-4 bg-background">
            <LoginForm
                onSubmit={handleLogin}
                showCreateAccount={false}
            />
        </div>
    )
}