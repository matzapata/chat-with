"use client";

import Faq from "@/components/faq";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar/landing";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const plans = [
  {
    popular: false,
    title: "Basic plan",
    price: {
      monthly: "$10",
      annual: "$100",
    },
    description: "Our most popular plan for small teams.",
    features: [
      "Access to basic features",
      "Access to basic features",
      "Access to basic features",
      "Access to basic features",
    ],
  },
  {
    popular: true,
    title: "Pro plan",
    price: {
      monthly: "$10",
      annual: "$100",
    },
    description: "Advanced features and reporting.",
    features: [
      "Access to pro features",
      "Access to pro features",
      "Access to pro features",
      "Access to pro features",
    ],
  },
];

export default function PricingPage() {
  const [monthly, setIsMonthly] = useState(true);

  return (
    <div>
      <Navbar />

      {/* Pricing table section */}
      <div>
        {/* Heading */}
        <div className="py-16 lg:py-24 px-4 space-y-8">
          <div className="text-center space-y-4">
            <div className="space-y-3">
              <h3 className="text-brand-700 text-sm font-semibold">Pricing</h3>
              <h1 className="font-semibold text-4xl text-gray-900">
                Plans that fit your scale
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Simple, transparent pricing that grows with you. Try any plan free
              for 30 days.
            </p>
          </div>

          <div>
            <div className="bg-gray-50 w-fit mx-auto border border-gray-200 rounded-xl p-[6px] grid grid-cols-2">
              <button
                onClick={() => setIsMonthly(true)}
                className={`${
                  monthly
                    ? "bg-white rounded-md shadow-sm text-gray-700"
                    : "text-gray-500"
                } px-6 py-[10px] text-center font-semibold`}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setIsMonthly(false)}
                className={`${
                  !monthly
                    ? "bg-white rounded-md shadow-sm text-gray-700"
                    : "text-gray-500"
                } px-6 py-[10px] text-center font-semibold`}
              >
                Annual billing
                <span className="hidden md:inline-block text-sm font-medium bg-white rounded-full border py-[2px] px-[10px] ml-2">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="px-4 max-w-7xl mx-auto lg:px-8 lg:pb-24 grid lg:grid-cols-2 gap-4">
          {plans.map((plan, i) => (
            <div key={i} className="divide-y border rounded-2xl shadow-md">
              {/* price and description */}
              <div className="p-6 space-y-4 lg:flex lg:flex-row-reverse lg:justify-between lg:items-end">
                <div>
                  <span className="font-semibold text-5xl text-gray-900">
                    {monthly ? plan.price.monthly : plan.price.annual}
                  </span>
                  <span className="text-gray-700 pb-2 ml-1 text-nowrap">per month</span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-gray-900 font-semibold text-xl">
                    {plan.title}
                    {plan.popular && (
                      <span className="border ml-2 rounded-full bg-brand-50 border-brand-200 text-brand-700 text-sm px-[10px] py-[2px]">
                        Popular
                      </span>
                    )}
                  </h2>
                  <h3 className="text-gray-600">{plan.description}</h3>
                </div>
              </div>

              {/* features */}
              <div className="px-6 space-y-6 py-8">
                <div>
                  <h4 className="uppercase font-semibold text-gray-900">
                    Features
                  </h4>
                  <p className="text-gray-600">
                    Everything in our free plan plus....
                  </p>
                </div>
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex space-x-3">
                      {/* check icon */}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                      >
                        <rect width="24" height="24" rx="12" fill="#DCFAE6" />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M17.0965 7.39004L9.9365 14.3L8.0365 12.27C7.6865 11.94 7.1365 11.92 6.7365 12.2C6.3465 12.49 6.2365 13 6.4765 13.41L8.7265 17.07C8.9465 17.41 9.3265 17.62 9.7565 17.62C10.1665 17.62 10.5565 17.41 10.7765 17.07C11.1365 16.6 18.0065 8.41004 18.0065 8.41004C18.9065 7.49004 17.8165 6.68004 17.0965 7.38004V7.39004Z"
                          fill="#17B26A"
                        />
                      </svg>

                      <p className="text-gray-600">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Get started button */}
              <div className="p-6">
                <Button variant="primary" size="xl" className="w-full">
                  Get started
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently asked questions section */}
      <Faq />

      {/* Footer section */}
      <Footer />
    </div>
  );
}
