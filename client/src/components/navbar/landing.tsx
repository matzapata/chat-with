"use client";
import { Bars4Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Logo from "../logo";
import { useState } from "react";
import { HomeLineIcon } from "../icons/home-line";
import { SettingsIcon } from "../icons/settings";
import { Avatar } from "../avatar";
import { PrimaryButton } from "../buttons/primary";
import { SecondaryGrayButton } from "../buttons/secondary-gray";
import { TertiaryGrayButton } from "../buttons/tertiary-gray";

const navbarItems = [{ title: "Home" }, { title: "Pricing" }];

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
    <div className="border-b shadow-sm">
      <div className="p-4 flex justify-between items-center border-b-gray-200">
        <Logo />
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 hover:bg-gray-50 rounded"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars4Icon className="h-6 w-6" />
          )}
        </button>
      </div>
      {isOpen && (
        <div>
          <div className="space-y-2 py-6 border-b">
            <button className="px-4 py-3 font-semibold block text-gray-800">
              Home
            </button>
            <button className="px-4 py-3 font-semibold block text-gray-800">
              Pricing
            </button>
          </div>
          <div className="py-6 px-4 space-y-3">
            <PrimaryButton>Sign up</PrimaryButton>

            <SecondaryGrayButton>Log in</SecondaryGrayButton>
          </div>
        </div>
      )}
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
            <TertiaryGrayButton>Log in</TertiaryGrayButton>
            <PrimaryButton>Sign up</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
