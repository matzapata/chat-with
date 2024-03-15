import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Button } from "@/components/ui/button";
import { paymentsService } from "@/lib/services/payments-service";
import Link from "next/link";
import { apiService } from "@/lib/services/api-service";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default async function PricingPage() {
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessTokenRaw = await getAccessTokenRaw();
  apiService.setAccessToken(accessTokenRaw);

  const plans = await paymentsService.getPlans();
  
  // Create the checkout session
  let checkoutUrl: string | undefined;
  if (accessTokenRaw) {
    try {
      // check if the user has an active subscription
      checkoutUrl = await paymentsService.createCheckout(plans.pro.variant_id as string);
    } catch (e) {}
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple no-tricks pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et
            quasi iusto modi velit ut non voluptas in. Explicabo id ut laborum.
          </p>
        </div>

        {/* PRO pricing card */}
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx -0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              Lifetime membership
            </h3>
            <p className="mt-6 text-base leading-7 text-gray-600">
              Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque
              amet indis perferendis blanditiis repellendus etur quidem
              assumenda.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-brand-600">
                What’s included
              </h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <ul
              role="list"
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
            >
              {plans.pro.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className="h-6 w-5 flex-none text-brand-600"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">
                  Pay once, own it forever
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    ${plans.pro.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    USD
                  </span>
                </p>

                {accessTokenRaw ? (
                  <Link href={checkoutUrl ?? "/app/settings/billing"}>
                    <Button className="mt-10 block w-full rounded-md bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
                      {checkoutUrl ? "Get access" : "Manage subscription"}
                    </Button>
                  </Link>
                ) : (
                  <LoginLink postLoginRedirectURL="/pricing">
                    <Button className="mt-10 block w-full rounded-md bg-brand-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600">
                      Get access
                    </Button>
                  </LoginLink>
                )}

                <p className="mt-6 text-xs leading-5 text-gray-600">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Still access for free */}
        <div className="mx-auto mt-16 p-6 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx- 0 lg:max-w-3xl space-y-4">
          <h1 className="text-brand-600 font-medium text-lg">
            Get started for free, no credit card required
          </h1>
          <div className="space-y-4">
            <p className="text-gray-600">
              Dolor dolores repudiandae doloribus. Rerum sunt aut eum. Odit
              omnis non voluptatem sunt eos nostrum.
            </p>
            <RegisterLink postLoginRedirectURL="/app/chat">
              <Button
                variant={"secondary-color"}
                size={"sm"}
                className="space-x-2 mt-4"
              >
                <span>Register</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Button>
            </RegisterLink>
          </div>
        </div>
      </div>
    </div>
  );
}
