import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

// Zod validation schema
const loginSchema = z.object({
    userId: z.string()
        .min(4, { message: "login.userId.errors.min" })
        .max(20, { message: "login.userId.errors.max" })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "login.userId.errors.regex" }),
    password: z.string()
        .min(8, { message: "login.password.errors.min" })
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (data: LoginFormValues) => void | Promise<void>;
    showForgotPassword?: boolean;
    showCreateAccount?: boolean;
    cardClassName?: string;
    formClassName?: string;
}

export function LoginForm({
    onSubmit,
    showForgotPassword = true,
    showCreateAccount = true,
    cardClassName = "w-full max-w-md ",
    formClassName = ""
}: LoginFormProps) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    // Initialize form with React Hook Form and Zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    });

    // Form submission handler
    const onSubmitHandler: SubmitHandler<LoginFormValues> = async (data) => {
        try {
            await onSubmit(data);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Card className={cardClassName}>
            <CardHeader>
                <CardTitle>{t('login.title')}</CardTitle>
                <CardDescription>{t('login.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmitHandler)} className={formClassName}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="userId">{t('login.userId.label')}</Label>
                            <Input
                                id="userId"
                                type="text"
                                placeholder={t('login.userId.placeholder')}
                                {...register('userId')}
                            />
                            {errors.userId && errors.userId.message && (
                                <p className="text-red-500 text-sm">
                                    {t(errors.userId.message as string)}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">{t('login.password.label')}</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('login.password.placeholder')}
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && errors.password.message && (
                                <p className="text-red-500 text-sm">
                                    {t(errors.password.message as string)}
                                </p>
                            )}
                        </div>
                        {showForgotPassword && (
                            <div className="flex items-center justify-end">
                                <a
                                    href="#"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    {t('login.forgotCredentials.link')}
                                </a>
                            </div>
                        )}
                    </div>
                    <CardFooter className="p-0 pt-4 flex flex-col space-y-2">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? t('login.submitButton.loggingIn')
                                : t('login.submitButton.login')
                            }
                        </Button>
                        {showCreateAccount && (
                            <Button
                                variant="outline"
                                type="button"
                                className="w-full foreground"
                            >
                                {t('login.createAccount.text')}
                            </Button>
                        )}
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}
