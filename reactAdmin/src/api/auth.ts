import { api } from "./apiClient.ts";

export interface RegisterFormData {
    userName: string;
    passUser: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface LoginFormData {
    userName: string;
    passUser: string;
}

export interface UserData {
    idUser: number;
    user: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
}

export interface TokenData {
    access_token: string;
    refresh_token: string;
    expires_in: number | null;
}

export interface AuthResponse {
    userData: UserData;
    tokenUser: TokenData;
}

// --------------------------------

export async function register(formData: RegisterFormData): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/register", formData, {
        params: { oauth_client: "my-admin_panel" },
        headers: { "Content-Type": "application/json" },
    });
}

export async function login(formData: LoginFormData): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/login", formData, {
        params: { oauth_client: "my-admin_panel" },
        headers: { "Content-Type": "application/json" },
    });
}