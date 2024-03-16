"use client";

import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

export default function GoProButton(props: { checkoutUrl?: string }) {
  return (
    <Button
      onClick={() => {
        if (props.checkoutUrl) window.location.assign(props.checkoutUrl);
        else
          toast({
            variant: "destructive",
            description: "Something went wrong. Please refresh and try again.",
          });
      }}
      variant="primary"
      size="sm"
    >
      Go PRO!
    </Button>
  );
}
