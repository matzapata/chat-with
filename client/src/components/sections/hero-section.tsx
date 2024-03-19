import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "../ui/button";
import { IconPlayCircle } from "../ui/icons";
import { Avatar, AvatarImage } from "../ui/avatar";
import images from "@/assets/images";

export default function HeroSection() {
  return (
    <div id="hero" className="px-4 mt-16 md:mt-24">
      <h1 className="md:text-6xl text-3xl font-semibold text-center text-gray-900">
        Manage your business <br />{" "}
        <span className="text-brand-600">expenses with ease</span>
      </h1>
      <h2 className="mt-4 md:text-base text-gray-600 text-sm text-center max-w-3xl md:mx-auto">
        Powerful, self-serve product and growth analytics to help you convert,
        engage, and retain more users. Trusted by over 4,000 startups.
      </h2>

      <div className="mt-8 space-y-3 md:space-y-0 md:flex md:flex-row-reverse md:justify-center md:space-x-3">
        <RegisterLink>
          <Button variant={"primary"} className="w-full md:w-auto md:ml-4">
            Sign up
          </Button>
        </RegisterLink>

        <Button
          variant={"secondary-gray"}
          className="w-full md:w-auto items-center space-x-2"
        >
          <IconPlayCircle className="h-5 w-5 text-gray-700 inline-block" />
          <span className="text-gray-700">Demo</span>
        </Button>
      </div>

      <div className="mt-14 space-y-4">
        <div className="flex justify-center -space-x-2">
          <Avatar className="border border-white">
            <AvatarImage src={images.AvatarSticker01.src} alt="Avatar" />
          </Avatar>
          <Avatar className="border border-white">
            <AvatarImage src={images.AvatarSticker02.src} alt="Avatar" />
          </Avatar>
          <Avatar className="border border-white">
            <AvatarImage src={images.AvatarSticker03.src} alt="Avatar" />
          </Avatar>
          <Avatar className="border border-white">
            <AvatarImage src={images.AvatarSticker04.src} alt="Avatar" />
          </Avatar>
          <Avatar className="border border-white">
            <AvatarImage src={images.AvatarSticker05.src} alt="Avatar" />
          </Avatar>
        </div>
        <div className="text-center text-sm text-gray-600">
          Trusted by over{" "}
          <span className="text-brand-600 font-medium">1,000+</span> businesses
          worldwide
        </div>
      </div>

      {/* TODO: Optional screenshot */}
      {/*  
          <div className="py-16">
          <Image
            className="md:hidden border-4 mx-auto rounded-md border-gray-900"
            src={images.HeroScreenMockup}
            height={220}
            alt="Screen mockup"
          />
          <Image
            className="hidden md:block border-4 mx-auto rounded-xl border-gray-900"
            src={images.HeroScreenMockupDesktop}
            height={560}
            alt="Screen mockup"
          />
          </div> 
        */}
    </div>
  );
}
