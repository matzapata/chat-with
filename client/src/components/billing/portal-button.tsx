"use client";

import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

export default function PortalButton(props: { portalUrl?: string }) {
  return (
    <Button
      onClick={() => {
        if (props.portalUrl) window.location.assign(props.portalUrl);
        else
          toast({
            variant: "destructive",
            description: "Something went wrong. Please refresh and try again.",
          });
      }}
      variant="secondary-gray"
      size="sm"
    >
      Manage
    </Button>
  );
}
