"use client";

import { Bars4Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Logo from "../logo";
import { useState } from "react";
import { HomeLineIcon } from "../icons/home-line";
import { LifeBouyIcon } from "../icons/life-bouy";
import { LogOutIcon } from "../icons/log-out";
import { SettingsIcon } from "../icons/settings";
import { Avatar } from "../avatar";

const navbarItems = [
  { title: "Home", icon: <HomeLineIcon className="h-5 w-5 text-gray-500" /> },
];

export default function Navbar() {
  return (
    <>
      <div className="md:hidden">
        <MobileNavbar />
      </div>
      <div className="hidden md:block">
        <DesktopNavbar />
      </div>
    </>
  );
}

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="p-4 flex justify-between items-center border-b border-b-gray-200">
        <Logo />
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-50 rounded"
        >
          <Bars4Icon className="h-6 w-6" />
        </button>
      </div>
      {isOpen && (
        <div className="z-50 bg-gray-900/70 absolute top-0 left-0 h-screen w-screen">
          <div className="w-[310px] bg-white h-screen flex flex-col justify-between">
            <div>
              <div className="px-4 pt-4 space-y-4">
                <Logo />
                <div className="flex py-[10px] px-3 border border-gray-300 space-x-2 rounded-md items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full placeholder:text-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5 space-y-2 px-2">
                {navbarItems.map((item, i) => (
                  <SidebarNavItem key={i} title={item.title} icon={item.icon} />
                ))}
              </div>
            </div>

            <div className="px-2">
              <div className="mb-6 space-y-2">
                <SidebarNavItem
                  title="Support"
                  icon={<LifeBouyIcon className="h-5 w-5 text-gray-500" />}
                />
                <SidebarNavItem
                  title="Settings"
                  icon={<SettingsIcon className="h-5 w-5 text-gray-500" />}
                />
              </div>

              <hr />

              <div className="flex items-center justify-between pt-6 pb-8 px-2">
                <div className="flex ml-2">
                  {/* Avatar */}
                  <Avatar />

                  {/* Name and email */}
                  <div className="ml-3">
                    <p className="text-sm font-semibold">Olivia Rhye</p>
                    <p className="text-sm">olivia@untitledui.com</p>
                  </div>
                </div>

                <button className="p-2">
                  <LogOutIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          <button
            className="absolute right-5 top-5"
            onClick={() => setIsOpen(false)}
          >
            <XMarkIcon className="h-6 w-6 text-white" />
          </button>
        </div>
      )}
    </>
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

function DesktopNavbar() {
  return (
    <div>
      <div className="border-b border-b-gray-200 flex justify-center">
        <div className="px-16 max-w-6xl w-full flex justify-between py-4 items-center">
          <div className="flex items-center">
            <Logo />
            <div className="flex items-center space-x-2 ml-4">
              {navbarItems.map((item, i) => (
                <button
                  key={i}
                  className="px-3 py-1 text-md font-semibold text-gray-700"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="rounded-md py-2 px-[10px] hover:bg-gray-50 ">
              <SettingsIcon className="h-5 w-5" />
            </button>
            <Avatar />
          </div>
        </div>
      </div>

      {/* Submenu */}
      <div className="border-b border-b-gray-200 flex justify-center">
        <div className="px-16 max-w-6xl w-full flex py-3 items-center">
          <button className="px-3 py-1 text-md font-semibold text-gray-700">
            Filename.txt
          </button>

          <button className="px-3 py-1 text-md font-semibold text-gray-700">
            Documents
          </button>
        </div>
      </div>
    </div>
  );
}
