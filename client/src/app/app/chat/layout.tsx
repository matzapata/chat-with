import AppLayout from "@/layouts/app-layout";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout
      nestedItems={[
        {
          link: "/app/chat/documents",
          title: "Documents",
        },
        {
          link: "/app/chat",
          title: "Filename.txt",
        },
      ]}
    >
      {children}
    </AppLayout>
  );
}
