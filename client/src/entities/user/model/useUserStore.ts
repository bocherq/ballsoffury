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
    fetchUser: () => Promise<void>;
}

export const useUsersStore = create<UserStore>(() => ({
    user: null,
    fetchUser: async () => {
        
    },
}));
