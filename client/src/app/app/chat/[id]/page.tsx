import { Chat } from "@/components/chat/chat";
import { apiService } from "@/lib/services/api-service";
import { chatService } from "@/lib/services/chat-service";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessTokenRaw = await getAccessTokenRaw();
  apiService.setAccessToken(accessTokenRaw);

  const chat = await chatService.getChat(params.id);

  return (
    <div className="relative">
      <div className="h-10 bg-white border-b sticky top-16 z-50 left-0 w-screen px-2 md:px-8 flex items-center">
        <span className="text-sm font-medium text-gray-600">{chat.filename}</span>
      </div>
      <Chat id={params.id} initialMessages={chat.messages} />;
    </div>
  );
}
