import { chatInterface, messageInterface, userTypes } from "@/types/types";
import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

interface ChatStore {
  chatList: chatInterface[];
  fetchChats: () => Promise<void>;

  createChat: (title: string, description: string) => Promise<void>;
  updateChat: (id: string, title: string, description: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;

  chatUsers: userTypes[];
  fetchChatUsers: (chatId: string) => Promise<void>;

  removeUser: (userId: string, chatId: string) => Promise<void>;

  addUser: (userId: string, chatId: string) => Promise<void>;

  singleChat: chatInterface | null;
  fetchSingleChat: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chatList: [],
  setIsLoading: (isLoading) => set({ isLoading }),
  isLoading: false,
  fetchChats: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/api/chat");
      set({ chatList: response.data });
    } catch (error: any) {
      toast.error(error.response.data.error || "Failed to fetch chats");
    } finally {
      set({ isLoading: false });
    }
  },

  createChat: async (title, description) => {
    set({ isLoading: true });
    try {
      const response = await axios.post("/api/chat", { title, description });
      toast.success("Chat created successfully");

      const createdChat = response.data;

      set((state) => ({ chatList: [...state.chatList, createdChat] }));
    } catch (error: any) {
      toast.error(error.response.data.error || "Failed to create chat");
    } finally {
      set({ isLoading: false });
    }
  },

  updateChat: async (id, title, description) => {
    set({ isLoading: true });
    try {
      await axios.put("/api/chat", { id, title, description });
      toast.success("Chat updated successfully");

      set((state) => ({
        chatList: state.chatList.map((chat) => {
          if (chat.id === id) {
            return { ...chat, title, description };
          }
          return chat;
        }),
      }));
    } catch (error: any) {
      toast.error(error.response.data.error || "Failed to update chat");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteChat: async (id) => {
    set({ isLoading: true });
    try {
      await axios.delete("/api/chat", { data: { id } });
      toast.success("Chat deleted successfully");
      set((state) => ({
        chatList: state.chatList.filter((chat) => chat.id !== id),
      }));
    } catch (error: any) {
      toast.error(error.response.data.error || "Failed to delete chat");
    } finally {
      set({ isLoading: false });
    }
  },

  chatUsers: [],
  fetchChatUsers: async (chatId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`/api/chat/users?chatId=${chatId}`);
      set({ chatUsers: response.data });
    } catch (error: any) {
      toast.error(error.response.data.error || "Failed to fetch chat users");
    } finally {
      set({ isLoading: false });
    }
  },

  removeUser: async (userId, chatId) => {
    set({ isLoading: true });
    try {
      await axios.delete(`/api/chat/users?userId=${userId}&chatId=${chatId}`);
      toast.success("User removed from chat");
      set((state) => ({
        chatUsers: state.chatUsers.filter((user) => user.id !== userId),
      }));
    } catch (error: any) {
      toast.error(
        error.response.data.error || "Failed to remove user from chat"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  addUser: async (userId, chatId) => {
    set({ isLoading: true });
    try {
      await axios.post(`/api/chat/users`, { userId, chatId });
      toast.success("User added to chat");
      set((state) => ({
        chatUsers: [
          ...state.chatUsers,
          state.chatUsers.find((user) => user.id === userId)!,
        ],
      }));
    } catch (error: any) {
      toast.error(error.response.data.error || "Failed to add user to chat");
    } finally {
      set({ isLoading: false });
    }
  },

  singleChat: null,
  fetchSingleChat: async (chatId) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`/api/chat/${chatId}`);
      set({ singleChat: response.data });
    } catch (error: any) {
      toast.error(error.response.data.error || "Failed to fetch chat");
    } finally {
      set({ isLoading: false });
    }
  },
}));
