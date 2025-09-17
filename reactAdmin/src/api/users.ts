import { api } from "./apiClient.ts";

// oauth_client - telegram-app (получаем юзеров из тг)

export interface UsersFormData {
    id_user: number;
    offset: number;
    limit: number;
}

export interface User {
    idUser: number;
    user: string;
    email: string;
    firstName: string;
    lastName: string;
    RoleId: number;
}

export interface UsersResponse {
    users: User[];
    total: number;
    Offset_current: number;
    message?: string;
}

// --------------------------------

export async function getUsers(formData: UsersFormData): Promise<UsersResponse> {
    return api.post<UsersResponse>("/auth/get_users", null, {
        params: {
            oauth_client: "my-admin_panel",
            id_user: formData.id_user,
            offset: formData.offset,
            limit: formData.limit,
        },
        headers: { "Content-Type": "application/json" },
    });
}