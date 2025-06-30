import type { User } from "../entities/user/model/useUserStore";
import { user } from "../mock/user";

export const fetchUser = (): Promise<User> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(user);
        }, 1000);
    });
}