export type NestApiResponse<T = Record<string, unknown>> = {
    statusCode: number;
    message: string;
    data?: T;
    error?: string;
    success: boolean;
    code?: string;
    path?: string;
    timestamp?: string;
};

export type RefreshTokenResponse = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: string;
};

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};