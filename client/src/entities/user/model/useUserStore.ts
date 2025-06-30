import { fetchUser } from '../../../api/user';
import { create } from 'zustand';

interface PodiumPlaces {
    first: string[];
    second: string[];
    third: string[];
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
    rating: number;
    podiumPlaces: PodiumPlaces;
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
