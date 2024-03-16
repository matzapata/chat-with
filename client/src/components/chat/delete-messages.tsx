"use client";

import { Button } from "../ui/button";
import useChat from "@/lib/hooks/use-chat";

export default function DeleteMessages(props: { id: string }) {
  const { clearMessages } = useChat(props.id);

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
