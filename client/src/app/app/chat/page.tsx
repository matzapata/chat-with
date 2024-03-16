import ChatsPanel from "@/components/chat-panel/chats-panel";
import ChatLayout from "@/layouts/chat-layout";
import { apiService } from "@/lib/services/api-service";
import { chatService } from "@/lib/services/chat-service";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Chats() {
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessTokenRaw = await getAccessTokenRaw();
  apiService.setAccessToken(accessTokenRaw);

  // Get initial chats
  const chats = await chatService.getAllChats();

  return (
    <ChatLayout>
      <ChatsPanel initialChats={chats} />;
    </ChatLayout>
  );
}
