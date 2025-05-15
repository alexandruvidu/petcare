import { UserRoleEnum } from "@infrastructure/apis/client";

export type ProfileState = {
    loggedIn: boolean;
    token: string | null;
    userId: string | null;
    name: string | null;
    email: string | null;
    role: UserRoleEnum | null; // Added role
    exp: number | null;
};