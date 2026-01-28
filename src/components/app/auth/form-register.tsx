'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { z } from 'zod';
import { getNameSchema, getPasswordSchema, getEmailSchema } from '@/lib/validators';
import i18nInstance from '@/locale/i18n';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

import { otpStorage } from '@/lib/otp-storage';
import { authService } from '@/services/auth-service';
import { CustomInput } from '@/components/custom/custom-input';
import { CustomButton } from '@/components/custom/custom-button';
import { CustomAlert } from '@/components/custom/custom-alert';
import { toast } from 'sonner';
import { BackButton } from '@/components/custom/back-button';

export default function RegisterForm() {
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const lockRef = React.useRef(false);
  const { t, i18n } = useTranslation('auth');

  // Tạo lại schema khi ngôn ngữ thay đổi
  const registerSchema = React.useMemo(() => {
    return z.object({
      username: getNameSchema(),
      email: getEmailSchema(),
      password: getPasswordSchema(),
      confirmPassword: z.string(),
    }).refine(d => d.password === d.confirmPassword, {
      path: ['confirmPassword'],
      message: i18nInstance.t('validation:password.notMatch'),
    });
  }, [i18n.language]);
  
  type RegisterFormValues = z.infer<typeof registerSchema>;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    if (lockRef.current) return;
    lockRef.current = true;
    setIsLoading(true);
    setShowAlert(false);

    try {
      // Call register API
      const result = await authService.register({
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (!result.ok) {
        setAlertMessage(result.message || t('register.failed'));
        setShowAlert(true);
        return;
      }

      // Registration successful, backend auto sends OTP
      toast?.success(t('register.success'));

      // Save OTP session info
      otpStorage.set({
        phone: values.email,
        purpose: 'register',
        tempData: {
          username: values.username,
          email: values.email,
          password: values.password,
        }
      });

      // Redirect to OTP page
      router.push('/otp');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register';
      setAlertMessage(errorMessage);
      setShowAlert(true);
      console.error('Register error:', err);
    } finally {
      lockRef.current = false;
      setIsLoading(false);
    }
  }

  return (
    <>
      <CustomAlert
        title="Error"
        description={alertMessage}
        show={showAlert}
        onClose={() => setShowAlert(false)}
        variant="destructive"
        duration={5000}
      />



      <div className="mx-auto w-full max-w-sm">
        <h1 className="mb-2 text-4xl font-bold text-[#238C98]">{t('register.title')}</h1>
        <div className="mb-6 text-[#1A5F6A]">{t('register.subtitle')}</div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              onSubmit,
              (errors) => {
                console.log('Form validation errors:', errors);
              }
            )}
            className="space-y-4"
          >
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="username">{t('register.username')}</Label>
                  <FormControl>
                    <CustomInput
                      id="username"
                      placeholder="joyer"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">{t('register.email')}</Label>
                  <FormControl>
                    <CustomInput
                      id="email"
                      type="email"
                      placeholder="joyer@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">{t('register.password')}</Label>
                  <div className="relative">
                    <FormControl>
                      <CustomInput
                        id="password"
                        type={showPw ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="confirmPassword">{t('register.confirmPassword')}</Label>
                  <div className="relative">
                    <FormControl>
                      <CustomInput
                        id="confirmPassword"
                        type={showPw2 ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPw2(!showPw2)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                      aria-label={showPw2 ? 'Hide password' : 'Show password'}
                    >
                      {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CustomButton
              variant="default"
              type="submit"
              className="mt-6 w-full font-semibold"
              disabled={form.formState.isSubmitting || isLoading || lockRef.current}
            >
              {isLoading || form.formState.isSubmitting ? 'Processing...' : t('register.registerButton')}
            </CustomButton>


          </form>
        </Form>

        <div className="mt-4 text-center text-base text-[#1A5F6A]">
          {t('register.haveAccount')}{' '}
          <CustomButton variant="link" className="p-1 text-base">
            <Link href="/login">{t('register.signIn')}</Link>
          </CustomButton>
        </div>
      </div>
    </>
  );
}