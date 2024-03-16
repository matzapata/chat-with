import ChatsPanel from "@/components/chat-panel/chats-panel";
import ChatLayout from "@/layouts/chat-layout";
import { apiService } from "@/lib/services/api-service";
import { chatService } from "@/lib/services/chat-service";
import { userService } from "@/lib/services/user-service";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Chats() {
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessTokenRaw = await getAccessTokenRaw();
  apiService.setAccessToken(accessTokenRaw);

  // Get initial chats
  const [user, chats] = await Promise.all([
    userService.get(),
   chatService.getAllChats(),
  ]);

  return (
    <ChatLayout user={{ email: user.email, isPro: user.is_pro }} >
      <ChatsPanel initialChats={chats} />;
    </ChatLayout>
  );
}
