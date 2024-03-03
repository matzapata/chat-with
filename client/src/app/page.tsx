"use client";

import { PrimaryButton } from "@/components/buttons/primary";
import { SecondaryGrayButton } from "@/components/buttons/secondary-gray";
import { PlayCircleIcon } from "@/components/icons/play-circle";
import Navbar from "@/components/navbar/landing";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import images from "@/assets/images";
import logos from "@/assets/images/logos";
import { useState } from "react";
import { MinusCircleIcon } from "@/components/icons/minus-circle";
import { PlusCircleIcon } from "@/components/icons/plus-circle";
import Logo from "@/components/logo";
import Footer from "@/components/footer";

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

const faq = [
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "Yes, you can change your plan at any time. You can also cancel your plan at any time.",
  },
  {
    question: "Can other info be added to an invoice?",
    answer:
      "Yes, you can add a note to an invoice. You can also add a note to a customer.",
  },
  {
    question: "Do you offer discounts for yearly payment?",
    answer:
      "Yes, we offer a 20% discount on yearly payments. You can change your billing period at any time.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel your subscription at any time. You can also pause your subscription for up to 3 months.",
  },
];

export default function Home() {
  const isDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

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
          <PrimaryButton
            size={isDesktop ? "2xl" : "md"}
            className="w-full md:w-auto md:ml-4"
          >
            Sign up
          </PrimaryButton>
          <SecondaryGrayButton
            size={isDesktop ? "2xl" : "md"}
            className="w-full md:w-auto items-center space-x-2"
          >
            <PlayCircleIcon className="h-5 w-5 text-gray-700 inline-block" />
            <span className="text-gray-700">Demo</span>
          </SecondaryGrayButton>
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
      <div className="py-16 space-y-12">
        {/* Title */}
        <div className="px-4 md:px-8 text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900">
            Frequently asked questions
          </h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about the product and billing.
          </p>
        </div>

        {/* Questions and answers */}
        <div className="px-4 md:px-8 divide-y max-w-3xl mx-auto">
          {faq.map((f, i) => (
            <div key={i} className="flex pt-6 pb-8">
              <div className="flex-grow">
                <h2 className="text-lg font-medium text-gray-900">
                  {f.question}
                </h2>
                {openFaqId === i && <p className="text-gray-600">{f.answer}</p>}
              </div>

              <div>
                {openFaqId === i ? (
                  <button className="py-1" onClick={() => setOpenFaqId(null)}>
                    <MinusCircleIcon className="h-6 w-6" />
                  </button>
                ) : (
                  <button className="py-1" onClick={() => setOpenFaqId(i)}>
                    <PlusCircleIcon className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contact us */}
        <div className="px-4">
          <div className="bg-gray-50 max-w-6xl mx-auto rounded-2xl space-y-6 px-5 py-8">
            {/* Team avatars */}
            <div className="flex items-baseline justify-center">
              <Image
                src={images.Avatar}
                height={40}
                width={40}
                className="inline-block rounded-full border border-white"
                alt="Avatar"
              />
              <Image
                src={images.Avatar}
                height={56}
                width={56}
                className="inline-block rounded-full -ml-4 z-10 border border-white"
                alt="Avatar"
              />
              <Image
                src={images.Avatar}
                height={40}
                width={40}
                className="inline-block rounded-full -ml-4 border border-white"
                alt="Avatar"
              />
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="text-xl font-semibold text-gray-900">
                Still have questions?
              </h1>
              <p className="md:text-lg text-gray-600">Can’t find the answer you’re looking for? Please chat to our friendly team.</p>
            </div>

            <PrimaryButton className="mx-auto">Get in touch</PrimaryButton>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
