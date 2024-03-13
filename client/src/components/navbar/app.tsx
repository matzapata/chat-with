import { Bars4Icon } from "@heroicons/react/24/solid";
import Logo from "../brand/logo";
import { Avatar } from "../replace-avatar";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconLifeBuoy, IconLogOut, IconSettings } from "../ui/icons";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export interface NavbarItem {
  title: string;
  link: string;
  icon?: React.ReactNode;
}

export default function Navbar({ items }: { items: NavbarItem[] }) {
  return (
    <div className="border-b h-16 border-b-gray-200 flex justify-center">
      <div className="px-8 w-full flex justify-between py-3 items-center">
        <div className="flex items-center">
          <Logo />
          <div className="flex items-center space-x-2 ml-4">
            {items.map((item, i) => (
              <Link
                key={i}
                href={item.link}
                className={"px-3 py-1 text-md font-semibold text-gray-700"}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            href={"/app/settings"}
            className="rounded-md py-2 px-[10px] hover:bg-gray-50 "
          >
            <IconSettings className="h-5 w-5" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogoutLink postLogoutRedirectURL="/">Logout</LogoutLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile burger and menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="items-center h-9 w-9 p-0 flex justify-center">
                <Bars4Icon className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="inset-y-0 flex h-auto w-[300px] flex-col p-0"
            >
              <div className="p-4 border-b">
                <Logo />
              </div>

              <div className="mt-5 space-y-2 px-2 flex-1">
                {items.map((item, i) => (
                  <SidebarNavItem key={i} title={item.title} icon={item.icon} />
                ))}
              </div>

              <div className="divide-y">
                <div className="mb-6 space-y-2">
                  <SidebarNavItem
                    title="Support"
                    icon={<IconLifeBuoy className="h-5 w-5 text-gray-500" />}
                  />
                  <SidebarNavItem
                    title="Settings"
                    icon={<IconSettings className="h-5 w-5 text-gray-500" />}
                  />
                </div>

                <div className="flex items-center justify-between py-6 px-2">
                  <div className="flex ml-2">
                    {/* Avatar */}
                    <Avatar />

                    {/* Name and email */}
                    <div className="ml-3">
                      <p className="text-sm font-semibold">Olivia Rhye</p>
                      <p className="text-sm">olivia@untitledui.com</p>
                    </div>
                  </div>

                  <LogoutLink postLogoutRedirectURL="/">
                    <button className="p-2">
                      <IconLogOut className="h-5 w-5 text-gray-500" />
                    </button>
                  </LogoutLink>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

function SidebarNavItem({
  active,
  icon,
  title,
}: {
  active?: boolean;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={`px-3 flex space-x-3 py-2 items-center rounded-md ${
        active ? "bg-gray-50" : ""
      }`}
    >
      {icon}
      <a href="#" className="text-gray-700 font-semibold">
        {title}
      </a>
    </div>
  );
}
