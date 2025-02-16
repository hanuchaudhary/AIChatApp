import { messageInterface } from "@/types/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const useMessages = (chatId: string) => {
  const [messages, setMessages] = useState<messageInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = async (chatId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/chat/${chatId}`);
      setMessages(response.data);
    } catch (error: any) {
      console.error(error.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(chatId);
  }, [chatId]);

  return { messages, isLoading, setMessages };
};
