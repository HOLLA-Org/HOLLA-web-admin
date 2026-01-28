'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { z } from 'zod';
import { getConfirmPasswordSchemaConfirm } from '@/lib/validators';

import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { CustomInput } from '@/components/custom/custom-input';
import { CustomButton } from '@/components/custom/custom-button';
import { BackButton } from '@/components/custom/back-button';

import { otpStorage } from '@/lib/otp-storage';
import { authService } from '@/services/auth-service';
import { customSonner } from '@/components/custom/cusrom-sonner';

export default function ResetPasswordForm() {
  const [show1, setShow1] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [otpInfo, setOtpInfo] = React.useState(otpStorage.get());
  const router = useRouter();
  const { t, i18n } = useTranslation('auth');

  // Tạo lại schema khi ngôn ngữ thay đổi
  const schema = React.useMemo(() => {
    return getConfirmPasswordSchemaConfirm();
  }, [i18n.language]);

  type Values = z.infer<typeof schema>;

  React.useEffect(() => {
    const info = otpStorage.get();
    if (!info || info.purpose !== 'forgot_password') {
      customSonner({
        title: 'Error',
        description: t('resetPassword.invalidSession'),
        variant: 'destructive',
      });
      // toast.error(t('resetPassword.invalidSession'));
      router.replace('/forgot-password');
    } else {
      setOtpInfo(info);
    }
  }, [router, t]);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirm: '' },
  });

  async function onSubmit(v: Values) {
    try {
      const result = await authService.resetPassword({
        token: otpInfo!.tempData?.token || '',
        newPassword: v.password,
      });
      if (!result.ok) {
        customSonner({
          title: 'Error',
          description: result.message || t('resetPassword.failed'),
          variant: 'destructive',
        });
        // toast.error(result.message || t('resetPassword.failed'));
        return;
      }
      customSonner({
        title: 'Success',
        description: t('resetPassword.success'),
        variant: 'success',
      });
      // toast.success(t('resetPassword.success'));
      otpStorage.clear();
      router.push('/login');
    } catch (error) {
      customSonner({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
      // toast.error('An error occurred. Please try again.');
    }
  }

  if (!otpInfo) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="mb-3 text-4xl font-bold text-[#238C98]">{t('resetPassword.title')}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label>{t('resetPassword.password')}</Label>
                <div className="relative">
                  <FormControl>
                    <CustomInput type={show1 ? 'text' : 'password'} {...field} />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShow1(!show1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  >
                    {show1 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm */}
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <Label>{t('resetPassword.confirmPassword')}</Label>
                <div className="relative">
                  <FormControl>
                    <CustomInput type={show2 ? 'text' : 'password'} {...field} />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShow2(!show2)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  >
                    {show2 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <CustomButton variant={'default'} type="submit" className="mt-12 w-full">
            {form.formState.isSubmitting ? 'Saving...' : t('resetPassword.resetButton')}
          </CustomButton>
        </form>
      </Form>

      <BackButton className="mt-6 mx-auto" label={t('back')} />
    </div>
  );
}
