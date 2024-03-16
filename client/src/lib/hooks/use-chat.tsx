import { useState } from "react";
import {
  ChatMessage,
  MessageRole,
  chatService,
} from "@/lib/services/chat-service";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { apiService } from "../services/api-service";
import { toast } from "@/components/ui/use-toast";

export default function useChat(
  chatId: string,
  initialMessages: ChatMessage[] = []
) {
  const { accessTokenRaw } = useKindeBrowserClient();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  const append = async (message: string) => {
    setMessages((prev) => [
      ...prev,
      { content: message, role: MessageRole.user },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      if (!accessTokenRaw) {
        throw new Error("No access token");
      }

      apiService.setAccessToken(accessTokenRaw);

      // append the message
      const response = await chatService.postMessage(chatId, message);
      setMessages((prev) => [
        ...prev,
        { content: response.content, role: MessageRole.ai },
      ]);
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = async () => {
    if (window.confirm("Are you sure you want to clear all messages?") === false) {
      return;
    }

    try {
      setIsLoading(true);
      console.log("deleting...")
      await chatService.clearMessages(chatId);

      setMessages([]);
    } catch (error) {
        console.log("error", error)
      toast({
        variant: "destructive",
        description: "Failed to clear messages",
      });
    } finally {
        console.log("finally")
      setIsLoading(false);
    }
  };

  return { messages, setMessages, isLoading, input, setInput, append, clearMessages };
}
