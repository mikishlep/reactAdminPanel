import { api } from "./apiClient.ts";

export interface PromoFormData {
    user_id: number;
    admin_user_id: number;
}

export interface UsePromocodeData {
    token: string;
    user_id: number;
    user_admin_id: number;
}

export interface Promocode {
    id: number;
    userId: number;
    name: string;
    description: string;
    promoCount: number;
    status: boolean;
    tokenHash: string;
    createdAt: Date;
}

export type PromocodeResponse = Promocode[];

// --------------------------------

export async function getPromocodesByUser(user_id: number, admin_user_id: number): Promise<Promocode[]> {
    return (await api.post<Promocode[]>(
        "/coupon/get_by_any_user_id",
        {},
        {
            params: { user_id, admin_user_id },
            headers: { "Content-Type": "application/json" },
        }
    )).map(p => ({ ...p, createdAt: new Date(p.createdAt) }));
}

export async function usePromocode(data: UsePromocodeData): Promise<Promocode> {
    const result = await api.post<Promocode>(
        "/coupon/used_any_coupon",
        {},
        {
            params: {
                token: data.token,
                user_id: data.user_id,
                user_admin_id: data.user_admin_id
            },
            headers: { "Content-Type": "application/json" },
        }
    );
    return { ...result, createdAt: new Date(result.createdAt) };
}