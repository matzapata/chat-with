import { Chat } from "@/components/chat/chat";
import { Message } from "@/components/chat/message";

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  // fetch initial messages server side
  const initialMessages: Message[] = [
    {
      content: "Hello",
      role: "user",
    },
    {
      content: "Hi",
      role: "agent",
    },
    {
      content: "Hello",
      role: "user",
    },
    {
      content: "Hi",
      role: "agent",
    },
    {
      content: "Hi",
      role: "agent",
    },
    {
      content: "Hi",
      role: "agent",
    },
    {
      content: "Hi",
      role: "agent",
    },

  ];

  return (
    <div className="relative">
      <div className="h-10 bg-white border-b sticky top-16 z-50 left-0 w-screen">

      </div>
      <Chat id={params.id} initialMessages={initialMessages} />;
    </div>
  );
}
