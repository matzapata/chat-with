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
          link: "/app/chat",
          title: "Filename.txt",
        },
        {
          link: "/app/chat/documents",
          title: "Documents",
        },
      ]}
    >
      {children}
    </AppLayout>
  );
}
