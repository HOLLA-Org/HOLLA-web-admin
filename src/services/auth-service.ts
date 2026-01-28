import { apiClient } from '../lib/api-client';
import { OtpPurpose } from '@/lib/otp-storage';

// Payload types
export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  address?: string;
  gender?: string;
  date_of_birth?: string;
};

export type LoginPayload = {
  account: string;
  password: string;
};

export type ResetPayload = {
  token: string;
  newPassword: string;
};

export type VerifyPayload = {
  email: string;
  codeId: string;
};

export type ResendCodePayload = {
  email: string;
};

export type CheckValidCodePayload = {
  email: string;
  code: string;
};

// Response types for Nest.js API
export type UserData = {
  _id: string;
  email: string;
  username: string;
  role: string;
};

export type TokenData = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  user: UserData;
  accessToken: string;
  refreshToken: string;
};

// Mapped response types for frontend use
export type RegisterResponse = {
  ok: boolean;
  redirectTo: string;
  message?: string;
  user?: UserData;
};

export type LoginResponse = {
  ok: boolean;
  redirectTo: string;
  message?: string;
  user?: UserData;
  accessToken?: string;
  refreshToken?: string;
};

export type ResetResponse = { ok: boolean; message?: string };
export type SendResetResponse = { ok: boolean; redirectTo: string; message?: string };
export type VerifyOtpResponse = { ok: boolean; message?: string, token?: string };
export type ResendOtpResponse = { ok: boolean; message?: string };

export const authService = {
  /**
   * Register a new user
   */
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    try {
      const response = await apiClient<UserData>('auth/admin/register', {
        method: 'POST',
        data: payload,
      });

      return {
        ok: true,
        redirectTo: '/otp',
        user: response,
      };
    } catch (error) {
      return {
        ok: false,
        redirectTo: '',
        message: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  },

  /**
   * Reset password
   */
  resetPassword: async (payload: ResetPayload): Promise<ResetResponse> => {
    try {
      await apiClient<void>('auth/admin/reset-password', {
        method: 'POST',
        data: payload,
      });

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Password reset failed',
      };
    }
  },

  /**
   * Check valid code (for forgot password)
   */
  checkValidCode: async (payload: CheckValidCodePayload): Promise<VerifyOtpResponse> => {
    try {
      const response = await apiClient<{ token: string }>('auth/admin/check-validcode', {
        method: 'POST',
        data: payload,
      });

      return {
        ok: true,
        token: response.token,
      };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Invalid code',
      };
    }
  },

  /**
   * Resend code
   */
  resendCode: async (payload: ResendCodePayload): Promise<ResendOtpResponse> => {
    try {
      await apiClient<void>('auth/admin/resend-code', {
        method: 'POST',
        data: payload,
      });

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Code resend failed',
      };
    }
  },

  /**
   * Verify account with code (for registration)
   */
  verifyAccount: async (payload: VerifyPayload): Promise<VerifyOtpResponse> => {
    try {
      await apiClient<void>('auth/admin/verify', {
        method: 'POST',
        data: payload,
      });

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Verification failed',
      };
    }
  },

  /**
   * Send reset password code
   */
  sendResetPassCode: async (email: string): Promise<SendResetResponse> => {
    try {
      await apiClient<void>('auth/admin/forgot-password', {
        method: 'POST',
        data: { email },
      });

      return {
        ok: true,
        redirectTo: '/otp',
      };
    } catch (error: unknown) {
      return {
        ok: false,
        redirectTo: '',
        message:
          error instanceof Error ? error.message : 'Failed to send reset code',
      };
    }
  },

  /**
   * Login user
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      const response = await apiClient<AuthResponse>('auth/admin/login', {
        method: 'POST',
        data: payload,
      });

      return {
        ok: true,
        redirectTo: '/',
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };
    } catch (error) {
      return {
        ok: false,
        redirectTo: '',
        message: error instanceof Error ? error.message : 'Login failed',
      };
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<{ ok: boolean }> => {
    try {
      await apiClient<void>('auth/admin/logout', {
        method: 'POST',
      });
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
      };
    }
  },
};
