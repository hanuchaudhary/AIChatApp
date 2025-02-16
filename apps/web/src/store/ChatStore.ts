import { chatInterface, messageInterface } from "@/types/types";
import { create } from "zustand";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface ChatStore {
  chatList: chatInterface[];
  fetchChats: () => Promise<void>;

  createChat: (title: string, description: string) => Promise<void>;
  updateChat: (id: string, title: string, description: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
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
      toast({
        title: "Failed to fetch chats",
        description: error.message || "Unknown error",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  createChat: async (title, description) => {
    set({ isLoading: true });
    try {
      const response = await axios.post("/api/chat", { title, description });
      toast({
        title: "Chat created successfully",
        description: `Chat "${title}" created successfully`,
      });

      const createdChat = response.data;

      set((state) => ({ chatList: [...state.chatList, createdChat] }));
    } catch (error: any) {
      toast({
        title: error.response.data.error || "Failed to create chat",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  updateChat: async (id, title, description) => {
    set({ isLoading: true });
    try {
      await axios.put("/api/chat", { id, title, description });
      toast({
        title: "Chat updated successfully",
        description: `Chat "${title}" updated successfully`,
      });

      set((state) => ({
        chatList: state.chatList.map((chat) => {
          if (chat.id === id) {
            return { ...chat, title, description };
          }
          return chat;
        }),
      }));
    } catch (error: any) {
      toast({
        title: "Failed to update chat",
        description: error.message || "Unknown error",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteChat: async (id) => {
    set({ isLoading: true });
    try {
      await axios.delete("/api/chat", { data: { id } });
      toast({
        title: "Chat deleted successfully",
        description: `Chat deleted successfully`,
      });
      set((state) => ({
        chatList: state.chatList.filter((chat) => chat.id !== id),
      }));
    } catch (error: any) {
      toast({
        title: "Failed to delete chat",
        description: error.message || "Unknown error",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
