import Navbar from "@/components/navbar/app";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="sticky top-0 z-50 shrink-0 h-16 bg-white w-screen">
        <Navbar items={[
          {
            title: "Home",
            link: "/app/chat",
          },
        ]}/>
      </nav>

      <main>
        {children}
      </main>
    </div>
  );
}
