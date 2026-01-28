'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

import { otpStorage } from '@/lib/otp-storage';
import { authService } from '@/services/auth-service';
import { toast } from 'sonner';
import { CustomButton } from '@/components/custom/custom-button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { BackButton } from '@/components/custom/back-button';
import { customSonner } from '@/components/custom/cusrom-sonner';
import { useTranslation } from 'react-i18next';

export default function OtpVerifyForm({ initialCooldown = 300 }: { initialCooldown?: number }) {
  const router = useRouter();
  const [otpInfo, setOtpInfo] = React.useState(otpStorage.get());

  const [otp, setOtp] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(initialCooldown);
  const [submitting, setSubmitting] = React.useState(false);
  const { t } = useTranslation('auth');

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Kiểm tra có OTP session không
  React.useEffect(() => {
    const Info = otpStorage.get();
    if (!Info) {
      router.replace('/login');
    } else {
      setOtpInfo(Info);
    }
  }, [router]);

  // Countdown timer cho resend
  React.useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown(val => (val > 0 ? val - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (raw: string) => {
    const onlyNumbers = raw.replace(/\D/g, '').slice(0, 6);
    setOtp(onlyNumbers);
    // Clear error khi user nhập
    if (error) setError(null);
  };

  const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = e => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text') ?? '';
    handleChange(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInfo) {
      setError(t('otp.noSession'));
      return;
    }

    if (otp.length < 6 || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      // Handle different purposes
      if (otpInfo.purpose === 'forgot_password') {
        const resetTokenResult = await authService.checkValidCode({
          email: otpInfo.phone,
          code: otp,
        });

        if (!resetTokenResult.ok || !resetTokenResult.token) {
          setError(resetTokenResult.message ?? t('otp.invalidCode'));
          setSubmitting(false);
          return;
        }

        otpStorage.update({
          tempData: {
            ...otpInfo.tempData,
            token: resetTokenResult.token,
          }
        });
        router.push('/reset-password');
      } else {
        // Default verification (register)
        const result = await authService.verifyAccount({
          email: otpInfo.phone,
          codeId: otp,
        });

        if (!result.ok) {
          setError(result.message ?? t('otp.failed'));
          setSubmitting(false);
          return;
        }

        otpStorage.clear();
        router.push('/login');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('otp.failed'));
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || submitting || !otpInfo) return;

    try {
      const result = await authService.resendCode({
        email: otpInfo.phone,
      });

      if (!result.ok) {
        setError(result.message ?? t('otp.resendFailed'));
        return;
      }

      customSonner({
        title: 'Success',
        description: t('otp.resendSuccess'),
        variant: 'success',
      });
      // toast.success('OTP resent successfully!');

      // Reset form
      setOtp('');
      setCooldown(initialCooldown);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('otp.resendFailed'));
    }
  };

  const disabled = submitting;

  if (!otpInfo) {
    return null;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-xs space-y-4">
        <h1 className="mb-2 text-5xl font-bold text-[#238C98]">{t('otp.title')}</h1>

        <div className="mb-6 text-[#1A5F6A]">
          <p className="text-sm">
            {t('otp.subtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <InputOTP
            value={otp}
            maxLength={6}
            onChange={handleChange}
            onPaste={handlePaste}
            className="gap-4"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="h-12 w-12 text-xl" />
              <InputOTPSlot index={1} className="h-12 w-12 text-xl" />
              <InputOTPSlot index={2} className="h-12 w-12 text-xl" />
            </InputOTPGroup>
            <span className="mx-3 text-2xl">•</span>
            <InputOTPGroup>
              <InputOTPSlot index={3} className="h-12 w-12 text-xl" />
              <InputOTPSlot index={4} className="h-12 w-12 text-xl" />
              <InputOTPSlot index={5} className="h-12 w-12 text-xl" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <CustomButton
          variant="default"
          type="submit"
          disabled={disabled || otp.length < 6}
          className="w-full mt-6"
        >
          {submitting ? t('otp.verifying') : t('otp.continue')}
        </CustomButton>

        <div className="flex items-center justify-center text-[14px] text-muted-foreground">
          <span>{t('otp.resendPrompt')}</span>
          <CustomButton
            type="button"
            variant="link"
            onClick={handleResend}
            disabled={disabled || cooldown > 0}
          >
            {cooldown > 0 ? t('otp.resendIn', { time: formatTime(cooldown) }) : t('otp.resend')}
          </CustomButton>
        </div>
      </form>

      <BackButton className="mt-6 mx-auto" label={t('back')} />
    </>
  );
}
