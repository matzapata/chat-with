import { Chat } from "@/components/chat/chat";
import { ChatMessage, MessageRole } from "@/lib/services/chat-service";

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  // fetch initial messages server side
  const filename = "Filename.txt";
  const initialMessages: ChatMessage[] = [
    {
      content: "Hello",
      role: MessageRole.user,
    },
    {
      content: "Hi",
      role: MessageRole.ai,
    },
    {
      content: "Hello",
      role: MessageRole.ai,
    },
    {
      content: "Hi",
      role: MessageRole.ai,
    },
    {
      content: "Hi",
      role: MessageRole.ai,
    },
    {
      content: "Hi",
      role: MessageRole.ai,
    },
    {
      content: "Hi",
      role: MessageRole.ai,
    },
  ];

  return (
    <div className="relative">
      <div className="h-10 bg-white border-b sticky top-16 z-50 left-0 w-screen px-2 md:px-8 flex">
          <button className="px-3 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-700 rounded">
            Documents
          </button>
          <button className="px-3 py-2 text-sm hover:bg-gray-50 font-semibold text-gray-700 rounded flex space-x-2 items-center">
            <span>{filename}</span>
          </button>
      </div>


      <Chat id={params.id} initialMessages={initialMessages} />;
    </div>
  );
}
