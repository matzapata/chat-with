"use client";

import { PlayCircleIcon } from "@/components/icons/play-circle";
import Navbar from "@/components/navbar/landing";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import images from "@/assets/images";
import logos from "@/assets/images/logos";
import Footer from "@/components/footer";
import Faq from "@/components/faq";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Share team inboxes",
    description:
      "Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.",
    icon: null,
  },
  {
    title: "Share team inboxes",
    description:
      "Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.",
    icon: null,
  },
  {
    title: "Share team inboxes",
    description:
      "Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.",
    icon: null,
  },
  {
    title: "Share team inboxes",
    description:
      "Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.",
    icon: null,
  },
  {
    title: "Share team inboxes",
    description:
      "Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.",
    icon: null,
  },
  {
    title: "Share team inboxes",
    description:
      "Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.",
    icon: null,
  },
];

export default function Home() {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  return (
    <main
      className="bg-top bg-repeat-x"
      style={{
        backgroundImage: `url('${
          isDesktop ? images.HeroBgDesktop.src : images.HeroBg.src
        }')`,
      }}
    >
      <Navbar />

      {/* hero section */}
      <div className="px-4 mt-16 md:mt-24">
        <h1 className="md:text-6xl text-3xl font-semibold text-center text-gray-900">
          Beautiful analytics to grow smarter
        </h1>
        <h2 className="mt-4 md:text-xl text-gray-600 text-lg text-center max-w-3xl md:mx-auto">
          Powerful, self-serve product and growth analytics to help you convert,
          engage, and retain more users. Trusted by over 4,000 startups.
        </h2>

        <div className="mt-8 space-y-3 md:space-y-0 md:flex md:flex-row-reverse md:justify-center md:space-x-3">
          <Button
            variant={"primary"}
            size={isDesktop ? "2xl" : "md"}
            className="w-full md:w-auto md:ml-4"
          >
            Sign up
          </Button>
          <Button
            variant={"secondary-gray"}
            size={isDesktop ? "2xl" : "md"}
            className="w-full md:w-auto items-center space-x-2"
          >
            <PlayCircleIcon className="h-5 w-5 text-gray-700 inline-block" />
            <span className="text-gray-700">Demo</span>
          </Button>
        </div>

        <div className="py-16">
          <Image
            className="md:hidden border-4 mx-auto rounded-md border-gray-900"
            src={images.HeroScreenMockup}
            height={220}
            alt="Screen mockup"
          />
          <Image
            className="hidden md:block border-t-4 border-x-4 mx-auto rounded-t-xl border-gray-900"
            src={images.HeroScreenMockupDesktop}
            height={560}
            alt="Screen mockup"
          />
        </div>
      </div>

      {/* Social proof section */}
      <div className="py-16 md:py-24 px-4 md:px-10">
        <p className="text-gray-600 text-center">
          Join 4,000+ companies already growing
        </p>
        <div className="grid grid-cols-2 md:grid-cols-6 mt-8 place-items-center gap-4 md:px-8">
          <Image src={logos.Boltshift} alt="Boltshift" height={36} />
          <Image src={logos.Featherdev} alt="Featherdev" height={36} />
          <Image src={logos.Globank} alt="Globank" height={36} />
          <Image src={logos.Lightbox} alt="Lightbox" height={36} />
          <Image src={logos.Netzche} alt="Netzche" height={36} />
          <Image src={logos.Spherule} alt="Spherule" height={36} />
        </div>
      </div>

      {/* Features section */}
      <div className="border-t py-16 md:py-24 space-y-12 md:space-y-16">
        <div className="px-4 space-y-4 max-w-3xl mx-auto">
          <p className="text-center font-semibold text-brand-600">Features</p>
          <h1 className="text-3xl font-semibold text-gray-900 text-center">
            Analytics that feels like it&apos;s from the future
          </h1>
          <p className="text-center text-lg text-gray-600">
            Powerful, self-serve product and growth analytics to help you
            convert, engage, and retain more users. Trusted by over 4,000
            startups.
          </p>
        </div>

        <div className="px-4 md:px-8 mx-auto place-items-center grid grid-col-1 md:grid-cols-3 gap-10 md:gap-x-8 md:gap-y-16">
          {features.map((f, i) => (
            <div className="text-center max-w-96" key={i}>
              {/* Icon */}
              <div className="mx-auto mb-4 bg-brand-100 border-[6px] border-brand-50 h-10 w-10 rounded-full"></div>

              {/* Text */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  Share team inboxes
                </h2>
                <p className="text-gray-600">
                  Whether you have a team of 2 or 200, our shared team inboxes
                  keep everyone on the same page and in the loop.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial section */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="px-4 md:px-8 max-w-7xl mx-auto space-y-8">
          <Image
            className="mx-auto"
            src={logos.Featherdev}
            height={40}
            alt="Featherdev logo"
          />

          <h1 className="font-medium text-3xl md:text-5xl text-center text-gray-900">
            We’ve been using Untitled to kick start every new project and can’t
            imagine working without it.
          </h1>

          <div className="space-y-4">
            {/* Avatar */}
            <div className="h-16 w-16 mx-auto">
              <Image
                src={images.Avatar}
                height={64}
                width={64}
                alt="Featherdev logo"
              />
            </div>

            {/* name and position */}
            <div className="space-y- text-center">
              <p className="text-gray-900 font-medium">John Doe</p>
              <p className="text-gray-600">CEO, Featherdev</p>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently asked questions */}
      <Faq />

      {/* Footer */}
      <Footer />
    </main>
  );
}
