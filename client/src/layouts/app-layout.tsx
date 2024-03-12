"use client";

import Navbar, { NavbarItem } from "@/components/navbar/app";
import { IconHome } from "@/components/ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppLayout({
  children,
  items,
  nestedItems,
  className,
}: {
  className?: string;
  children: React.ReactNode;
  items?: NavbarItem[];
  nestedItems?: NavbarItem[];
}) {
  const pathname = usePathname();

  return (
    <>
      <nav className={className ?? ""}>
        <Navbar
          items={
            items ?? [
              {
                title: "Home",
                icon: <IconHome className="h-5 w-5 text-gray-500" />,
                link: "/app/chat",
              },
            ]
          }
        />

        {/* Submenu */}
        {nestedItems && (
          <div className="border-b border-b-gray-200 flex justify-center bg-white">
            <div className="px-2 md:px-8 w-full flex py-2 items-center">
              {nestedItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.link}
                  className={`px-3 py-2 text-sm font-semibold text-gray-700 rounded ${
                    pathname === item.link ? "bg-gray-50" : ""
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      <main>{children}</main>
    </>
  );
}
