import { HomeLineIcon } from "@/components/icons/home-line";
import Navbar from "@/components/navbar/app";

const navbarItems = [
  {
    title: "Home",
    icon: <HomeLineIcon className="h-5 w-5 text-gray-500" />,
    link: "/app/chat",
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar items={navbarItems} subItems={[]} />
      {children}
    </main>
  );
}
