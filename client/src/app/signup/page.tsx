"use client";

import { GoogleIcon } from "@/components/icons/google";
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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Invalid email.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 2 characters.",
  }),
});

export default function SignUp() {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
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
            Create an account
          </h1>
          <p className="text-gray-600">Start your 30-day free trial.</p>
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          type="password"
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
                  Sign up
                </Button>
                <Button
                  className="w-full space-x-3"
                  size="lg"
                  variant="secondary-gray"
                >
                  <GoogleIcon className="h-5 w-5" />
                  <span className="text-gray-700">Sign up with Google</span>
                </Button>
              </div>
            </form>
          </Form>

          <div className="flex space-x-1 items-center justify-center">
            <p className="text-gray-600 text-sm">Already have an account</p>
            <Button
              onClick={() => router.push("/login")}
              size="sm"
              variant="link-color"
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
