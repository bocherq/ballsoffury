import api from "../shared/lib/api";
import type { User } from "../entities/user/model/useUserStore";

export const fetchUser = async (): Promise<User | null> => {
    try {
        return await api.get<User>('/auth/me');
    } catch(error) {
        return null;
    }
}
