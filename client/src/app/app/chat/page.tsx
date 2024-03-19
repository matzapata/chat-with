import ChatsPanel from "@/components/chat-panel/chats-panel";
import ChatLayout from "@/layouts/chat-layout";
import { chatService } from "@/lib/services/chat-service";
import { userService } from "@/lib/services/user-service";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Chats() {
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessTokenRaw = await getAccessTokenRaw();

  const [user, chats] = await Promise.all([
    userService.get(accessTokenRaw),
    chatService.getAllChats(accessTokenRaw),
  ]);

  return (
    <ChatLayout user={{ email: user.email, isPro: user.is_pro }}>
      <ChatsPanel initialChats={chats} />;
    </ChatLayout>
  );
}
