import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Key } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UI_ROUTES } from '@/constants/routes';

type Props = {};

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword = (props: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(t('login.forgotPassword.success'));
      navigate(UI_ROUTES.LOGIN)
    } catch (error) {
      alert(t('login.forgotPassword.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginNavigate = () => {
    navigate(UI_ROUTES.LOGIN)
  }
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary/5 to-primary/80 p-2 rounded-full shadow-lg">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 p-2 rounded-full">
                <Key className="text-primary text-xl" />
              </div>
            </div>
          </div>
          <CardTitle className="text-center">{t('login.forgotPassword.title')}</CardTitle>
          <CardDescription className="text-center">{t('login.forgotPassword.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">{t('login.forgotPassword.email.label')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('login.forgotPassword.email.placeholder')}
                  {...register('email', {
                    required: t('login.forgotPassword.email.error.required'),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t('login.forgotPassword.email.error.invalid'),
                    },
                  })}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>

          </form>
        </CardContent>
        <CardFooter className="flex-col space-y-2 mt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('loading') : t('login.forgotPassword.submit')}
          </Button>
          <Button
            type="button"
            className="w-full text-gray-500"
            variant="ghost"
            onClick={handleLoginNavigate}
          >
            <ArrowLeft />
            {t('login.forgotPassword.back')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
