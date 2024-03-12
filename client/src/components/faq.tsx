import { useState } from "react";
import Image from "next/image";
import images from "@/assets/images";
import { brandConfig } from "@/config/brand";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { IconMinusCircle, IconPlusCircle } from "./ui/icons";

export default function Faq() {
  const router = useRouter()
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  return (
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
        {brandConfig.faq.map((f, i) => (
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
                  <IconMinusCircle className="h-6 w-6" />
                </button>
              ) : (
                <button className="py-1" onClick={() => setOpenFaqId(i)}>
                  <IconPlusCircle className="h-6 w-6" />
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
            <p className="md:text-lg text-gray-600">
              Can’t find the answer you’re looking for? Please chat to our
              friendly team.
            </p>
          </div>

          <div className="flex justify-center">
            <Button onClick={() => router.push("/contact")} variant="primary" className="mx-auto">
              Get in touch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
