"use client";

import { chatService } from "@/lib/services/chat-service";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

export default function DeleteMessages(props: { id: string }) {
  const clearMessages = async () => {
    if (
      window.confirm("Are you sure you want to clear all messages?") === false
    ) {
      return;
    }

    try {
      await chatService.clearMessages(props.id);
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to clear messages",
      });
    }
  };

  return (
    <Button
      onClick={() => clearMessages()}
      variant={"link-gray"}
      size={"sm"}
      className="text-gray-600"
    >
      Delete messages
    </Button>
  );
}
