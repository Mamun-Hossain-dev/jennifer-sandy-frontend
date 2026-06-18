import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: DefaultSession["user"] & {
      id: string;
      role?: string;
      accessToken?: string;
      profilePicture?: string;
    };
  }

  interface User {
    id: string;
    role?: string;
    accessToken?: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: string;
    user?: {
      id?: string;
      role?: string;
      firstName?: string;
      lastName?: string;
      email?: string | null;
      image?: string | null;
      profilePicture?: string;
    };
  }
}
