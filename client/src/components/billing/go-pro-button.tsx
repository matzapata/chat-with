"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { paymentsService } from "@/lib/services/payments-service";

export default function GoProButton() {
  const { accessTokenRaw } = useKindeBrowserClient();

  return (
    <Button
      onClick={() => {
        if (!accessTokenRaw) {
          toast({
            variant: "destructive",
            description: "You need to be logged in to subscribe to a plan.",
          });
          return;
        }

        paymentsService
          .createCheckout()
          .then((url) => window.location.assign(url))
          .catch(() => {
            toast({
              variant: "destructive",
              description: "Something went wrong. Please try again.",
            });
          });
      }}
      variant="primary"
      size="sm"
    >
      Go PRO!
    </Button>
  );
}
