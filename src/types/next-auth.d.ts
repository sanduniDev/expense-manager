import { User as NextAuthUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string; // Add id here
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }

    interface User extends NextAuthUser {
        id: string; // Add id here
    }
}