import { userTypes } from "@/types/types";
import axios from "axios";
import { create } from "zustand";

interface UsersStore {
    users: userTypes[];
    isLoading: boolean;
    fetchUsers: (filter:string) => Promise<void>;
}

export const useUsersStore = create<UsersStore>((set, get) => ({
    users: [],
    isLoading: false,
    fetchUsers: async (filter) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/api/users?filter=${filter}`);
            set({ users: response.data });
        } catch (error: any) {
            console.error(error.message || "Unknown error");
        } finally {
            set({ isLoading: false });
        }
    },
}));