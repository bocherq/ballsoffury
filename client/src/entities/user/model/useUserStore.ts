import { fetchUser } from '../../../api/user';
import { create } from 'zustand';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
    rating: number;
    isAdmin: boolean;
}

interface UserStore {
    user: User | null;
    isLoading: boolean;
    getUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    isLoading: false,
    getUser: async () => {
        set({ isLoading: true });
        const user = await fetchUser();
        set({ user });
        set({ isLoading: false });
    },
}));
