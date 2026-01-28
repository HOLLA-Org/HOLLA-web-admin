'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { CustomButton } from '../../custom/custom-button';
import { CustomInput } from '../../custom/custom-input';
import { authService } from '@/services/auth-service';
import { otpStorage } from '@/lib/otp-storage';
import { BackButton } from '@/components/custom/back-button';
import { customSonner } from '@/components/custom/cusrom-sonner';

export default function ForgotPasswordForm() {
  const { t, i18n } = useTranslation('auth');
  const router = useRouter();

  // Tạo lại schema khi ngôn ngữ thay đổi
  const schema = React.useMemo(() => {
    return z.object({ 
      email: z.string()
        .min(1, { message: t('validation.usernameRequired') })
        .email({ message: t('email.invalid') })
    });
  }, [i18n.language, t]);

  type Values = z.infer<typeof schema>;

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: { email: '' },
  });

  async function onSubmit(v: Values) {
    const result = await authService.sendResetPassCode(v.email);

    if (!result.ok) {
      customSonner({
        title: 'Error',
        description: result.message || t('forgotPassword.failed'),
        variant: 'destructive',
      });
      // toast.error(result.message || t('forgotPassword.failed'));
      return;
    }

    // Successfully, save session info and redirect to OTP page
    customSonner({
      title: 'Success',
      description: result.message || t('forgotPassword.success'),
      variant: 'success',
    });
    // toast.success(result.message || t('forgotPassword.success'));

    otpStorage.set({
      phone: v.email,
      purpose: 'forgot_password',
    });

    router.push(result.redirectTo);
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="mb-3 text-4xl font-bold text-[#238C98]">{t('forgotPassword.title')}</h1>
      <div className="mb-6 text-[#a3a4a8]">{t('forgotPassword.subtitle')}</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email" className="text-[#5C6169]">
                  {t('forgotPassword.email')}
                </Label>
                <FormControl>
                  <CustomInput
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CustomButton
            variant="default"
            type="submit"
            className="mt-12 w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Sending...' : 'Send Code'}
          </CustomButton>
        </form>
      </Form>
        <BackButton className="mt-6 mx-auto" label={t('back')} />
    </div>
  );
}
