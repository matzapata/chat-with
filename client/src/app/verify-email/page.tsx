"use client";

import { ArrowLeftIcon } from "@/components/icons/arrow-back";
import { EmailIcon } from "@/components/icons/email";
import Navbar from "@/components/navbar/landing";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const router = useRouter();

  return (
    <div>
      <Navbar />

      <div className="py-12 md:py-20 space-y-8 max-w-lg mx-auto">
        <div className="space-y-3 text-center">
          <h1 className="text-gray-900 text-2xl md:text-3xl font-semibold">
            Check your email
          </h1>
          <p className="text-gray-600 max-w- mx-auto">
            We sent a verification link to olivia@untitledui.com
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => router.push("/login")}
            variant="primary"
            className="w-full"
          >
            Back to login
          </Button>

          <Button
            variant="link-gray"
            className="text-gray-600 font-normal text-center w-full"
          >
            Resend email
          </Button>
        </div>
      </div>
    </div>
  );
}
