"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/services/api-service";
import { contactService } from "@/lib/services/contact-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  message: z
    .string()
    .min(100, { message: "Message is too short minimum 100 characters" })
    .max(300, { message: "Message is too long maximum 300 characters" }),
  subject: z
    .string()
    .min(5, { message: "Subject is too short minimum 5 characters" })
    .max(50, { message: "Subject is too long maximum 50 characters" }),
});

export default function Contact() {
  const { user, accessTokenRaw} = useKindeBrowserClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!accessTokenRaw) {
      return toast({
        variant: "destructive",
        description: "You need to be logged in to send a message.",
      });
    }
    apiService.setAccessToken(accessTokenRaw);

    contactService
      .createContact(data.message, data.subject)
      .then(() => {
        toast({ description: "Message sent" });
        form.reset();
      })
      .catch(() => {
        toast({
          variant: "destructive",
          description: "Failed to send message, please try again",
        });
      });
  }

  return (
    <div>
      <div className="px-4 text-center space-y-4 py-16 md:py-24">
        <div className="text-center space-y-3">
          <p className="text-brand-700 font-semibold text-sm">Contact us</p>
          <h1 className="text-4xl font-semibold text-gray-900">Get in touch</h1>
        </div>
        <p className="text-gray-600 text-lg">
          We’d love to hear from you. Please fill out this form.
        </p>
      </div>

      <div className="px-4 pb-16 md:pb-24 max-w-3xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="font-medium text-sm text-gray-600">From</p>

                {user ? (
                  <p className="text-gray-900">{user.email}</p>
                ) : (
                  <p className="text-gray-900">
                    Please{" "}
                    <LoginLink
                      postLoginRedirectURL="/contact"
                      className="text-brand-600 font-medium"
                    >
                      login
                    </LoginLink>{" "}
                    to reach out.
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Leave us a message..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                variant="primary"
                disabled={!user}
              >
                Send message
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
