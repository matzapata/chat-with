"use client";

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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function Profile() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log(values);
  }

  return (
    <div className="py-8 md:py-12 space-y-8 max-w-6xl mx-auto">
      {/* Heading */}
      <div className="px-4 md:px-8">
        <div>
          <h1 className="font-semibold text-2xl md:3xl text-gray-900">
            General
          </h1>
        </div>
      </div>

      {/* Personal info */}
      <div className="md:px-8 px-4 ">
        {/* Section heading */}
        <div className="space-y-1 border-b pb-6">
          <h1 className="text-lg md:text-base text-gray-900 font-semibold">
            Personal info
          </h1>
          <p className="text-gray-600 text-sm">
            This is how others will see you on the site.
          </p>
        </div>

        {/* Name table */}
        <div className="divide-y divide-gray-200">
          {/* Name */}
          <div className="space-y-2 md:space-y-0 md:flex py-6">
            <p className="text-sm md:w-64 font-medium text-gray-900">
              Full name
            </p>
            <div className="flex md:flex-1 justify-between">
              <p className="text-sm text-gray-900">Tom Cook</p>
              <Button className="text-sm" variant="link-color">
                Update
              </Button>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2 md:space-y-0 md:flex py-6">
            <p className="text-sm md:w-64 font-medium text-gray-900">Email</p>
            <div className="flex md:flex-1 justify-between">
              <p className="text-sm text-gray-900">tomcook@apple.com</p>
              <Button className="text-sm" variant="link-color">
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:px-8 px-4 pt-10">
        <Button variant="secondary-gray">Logout</Button>
      </div>
    </div>
  );
}
