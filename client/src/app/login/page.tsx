"use client";

import { GoogleIcon } from "@/components/icons/google";
import Navbar from "@/components/navbar/landing";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
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

export default function Login() {
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

      <div className="py-12 md:py-20 space-y-8 max-w-96 mx-auto">
        <div className="space-y-2 text-center">
          <h1 className="text-gray-900 text-2xl md:text-3xl font-semibold">
            Log in to your account
          </h1>
          <p className="text-gray-600">
            Welcome back! Please enter your details.
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

              <div className="flex justify-end">
                <Button variant="link-color">Forgot password</Button>
              </div>

              <div className="space-y-4">
                <Button className="w-full" size="lg" variant="primary">
                  Sign in
                </Button>
                <Button
                  className="w-full space-x-3"
                  size="lg"
                  variant="secondary-gray"
                >
                  <GoogleIcon className="h-5 w-5" />
                  <span className="text-gray-700">Sign with Google</span>
                </Button>
              </div>
            </form>
          </Form>

          <div className="flex space-x-1 items-center justify-center">
            <p className="text-gray-600 text-sm">Don&apos;t have an account</p>
            <Button size="sm" variant="link-color">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
