import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
      role?: string | null;
      accessToken?: string;
      refreshToken?: string;
    };
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string | null;
  }

  interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    phone?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    error?: string | null;
  }
}
