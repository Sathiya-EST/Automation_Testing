import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UI_ROUTES } from '@/constants/routes';

type Props = {};

interface ChangePasswordForm {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ChangePassword = (props: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ChangePasswordForm>();

    const onSubmit = async (data: ChangePasswordForm) => {
        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock API call
            alert(t('login.changePassword.success'));
            navigate(UI_ROUTES.LOGIN);
        } catch (error) {
            alert(t('login.changePassword.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(UI_ROUTES.LOGIN);
    };

    const renderInputField = (
        id: keyof ChangePasswordForm,
        type: string,
        label: string,
        placeholder: string,
        validationRules: Record<string, any>,
        errorMessage?: string
    ) => (
        <div className="flex flex-col space-y-1.5">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                {...register(id, validationRules)}
                aria-invalid={!!errors[id]}
                aria-describedby={`${id}-error`}
            />
            {errors[id] && (
                <p id={`${id}-error`} className="text-red-500 text-sm">
                    {errorMessage || errors[id]?.message}
                </p>
            )}
        </div>
    );

    const newPassword = watch('newPassword');

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-center">{t('login.changePassword.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-4">
                            {renderInputField(
                                'oldPassword',
                                'password',
                                t('login.changePassword.oldPassword.label'),
                                t('login.changePassword.oldPassword.placeholder'),
                                {
                                    required: t('login.changePassword.oldPassword.error.required'),
                                }
                            )}
                            {renderInputField(
                                'newPassword',
                                'password',
                                t('login.changePassword.newPassword.label'),
                                t('login.changePassword.newPassword.placeholder'),
                                {
                                    required: t('login.changePassword.newPassword.error.required'),
                                }
                            )}
                            {renderInputField(
                                'confirmPassword',
                                'password',
                                t('login.changePassword.confirmPassword.label'),
                                t('login.changePassword.confirmPassword.placeholder'),
                                {
                                    required: t('login.changePassword.confirmPassword.error.required'),
                                    validate: (value: string) =>
                                        value === newPassword || t('login.changePassword.confirmPassword.error.mismatch'),
                                }
                            )}
                        </div>

                    </form>
                </CardContent>
                <CardFooter className="flex-col space-y-2 mt-4">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('loading') : t('login.changePassword.submit')}
                    </Button>
                    <Button
                        type="button"
                        className="w-full text-gray-500"
                        variant="ghost"
                        onClick={handleCancel}
                    >
                        {t('login.changePassword.back')}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ChangePassword;
