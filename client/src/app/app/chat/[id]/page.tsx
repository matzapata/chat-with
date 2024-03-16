import { Chat } from "@/components/chat/chat";
import DeleteMessages from "@/components/chat/delete-messages";
import ChatLayout from "@/layouts/chat-layout";
import { apiService } from "@/lib/services/api-service";
import { chatService } from "@/lib/services/chat-service";
import { userService } from "@/lib/services/user-service";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { getAccessTokenRaw } = getKindeServerSession();
  apiService.setAccessToken(await getAccessTokenRaw());

  const [user, chat] = await Promise.all([userService.get(), chatService.getChat(params.id)]);

  return (
    <ChatLayout user={{ email: user.email, isPro: user.is_pro }}>
      <div className="relative">
        <div className="h-10 bg-white border-b sticky top-16 z-50 left-0 w-screen px-4 md:px-8 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            {chat.filename}
          </span>
          <DeleteMessages id={params.id} />
        </div>
        <Chat id={params.id} initialMessages={chat.messages} />;
      </div>
    </ChatLayout>
  );
}
