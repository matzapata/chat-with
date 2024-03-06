"use client";

import { ArrowLeftIcon } from "@/components/icons/arrow-back";
import Navbar from "@/components/navbar/landing";
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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Invalid email.",
  }),
});

export default function ForgotPassword() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <div>
      <Navbar />

      <div className="py-12 md:py-20 space-y-8 max-w-lg mx-auto">
        <div className="space-y-2 text-center">
          <h1 className="text-gray-900 text-2xl md:text-3xl font-semibold">
            Forgot password?
          </h1>
          <p className="text-gray-600">
            No worries, we’ll send you reset instructions.
          </p>
        </div>

        <div className="px-4 space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <Button className="w-full" size="lg" variant="primary">
                  Reset password
                </Button>
              </div>
            </form>
          </Form>

          <Link href="/login" className="flex space-x-1 items-center justify-center">
            <ArrowLeftIcon className="" />
            <p className="text-gray-600 text-sm">Back to login</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
