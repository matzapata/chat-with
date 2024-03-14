import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { subscriptionConfig } from "@/config/subscription";
import { apiService } from "@/lib/services/api-service";
import { paymentsService } from "@/lib/services/payments-service";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";

export default async function Billing() {
  const { getAccessTokenRaw } = getKindeServerSession();
  apiService.setAccessToken(await getAccessTokenRaw());

  // Get the user's subscription
  const userPlan = await paymentsService.getSubscription();
  const userPlanId = userPlan?.id ?? null;

  // If no plan create checkout for user. Else get the management portal link
  let checkoutUrl: string | undefined;
  let portalUrl: string | undefined;
  if (userPlanId) {
    try {
      // check if the user has an active subscription
      checkoutUrl = await paymentsService.createCheckout(subscriptionConfig.proPlan.id);
    } catch (e) {}
  } else {
    try {
      // Create management portal link
      portalUrl = await paymentsService.createPortal();
    } catch (e) {}
  }

  // Get the plans
  const plans = Object.values(subscriptionConfig);

  return (
    <div className="py-8 md:py-12 space-y-8 max-w-6xl mx-auto">
      {/* Heading */}
      <div className="px-4 md:px-8 space-y-8 ">
        <h1 className="font-semibold text-2xl md:3xl text-gray-900">Billing</h1>

        <div className=" space-y-1 pb-5 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Account plans</h2>
          <p className="text-gray-600">
            Pick an account plan that fits your workflow.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="px-4 md:px-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="">
          <h2 className=" text-sm font-semibold text-gray-900">Current plan</h2>
          <p className=" text-sm text-gray-600">
            We’ll credit your account if you need to downgrade during the
            billing cycle.
          </p>
        </div>

        <div className="space-y-4 col-span-2 md:pt-5">
          {/* Plans cards */}
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              description={plan.description}
              interval={plan.interval}
              name={plan.name}
              price={plan.price}
              selected={userPlanId === plan.id}
            />
          ))}

          {userPlan === null ? (
            <Link
              href={checkoutUrl ?? ""}
              className={buttonVariants({ variant: "primary", size: "sm" })}
            >
              Go PRO!
            </Link>
          ) : (
            <Link
              href={portalUrl ?? ""}
              className={buttonVariants({
                variant: "secondary-gray",
                size: "sm",
              })}
            >
              Manage
            </Link>
          )}
        </div>
      </div>

      {/* Billing history */}
      {/* <BillingAndInvoicing /> */}
    </div>
  );
}

function PlanCard(props: {
  name: string;
  price: number;
  description: string;
  interval: string;
  selected?: boolean;
}) {
  return (
    <div
      className={`${
        props.selected ? "border-brand-600 border-[2px]" : "border"
      } rounded-xl`}
    >
      <div
        className={`${
          props.selected
            ? "md:border-0 border-b-[2px] md:border-b-0 border-brand-600"
            : "md:border-0 border-b"
        } flex items-center p-4`}
      >
        <div className="flex flex-grow space-x-4 items-center">
          <div className="h-8 w-8 bg-brand-100 border-4 border-brand-50 rounded-full flex items-center justify-center">
            <Square3Stack3DIcon className="h-5 w-5 text-brand-600" />
          </div>
          <div className="">
            <h2 className="font-semibold md:font-medium md:text-sm text-gray-700">
              {props.name} plan{" "}
              <span className="text-gray-600 hidden md:inline-block">
                ${props.price} per {props.interval}
              </span>
            </h2>
            <p className="text-gray-600 md:text-sm hidden md:block">
              {props.description}
            </p>
          </div>
        </div>
        <Checkbox
          disabled={true}
          checked={props.selected}
          className="text-brand-600 border-gray-200 rounded"
        />
      </div>

      <div className="p-4 space-y-1 md:hidden">
        <div>
          <span className="text-gray-700 text-2xl font-semibold">
            ${props.price}
          </span>
          <span className="text-gray-600 ml-1">per {props.interval}</span>
        </div>
        <p className="text-gray-600">{props.description}</p>
      </div>
    </div>
  );
}

// TODO: bring back or remove
function BillingAndInvoicing() {
  return (
    <div className="md:px-8 md:space-y-6">
      <div className="px-4 md:px-0 space-y-1 md:pb-5 md:border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          Billing and invoicing
        </h2>
        <p className="text-gray-600">
          Pick an account plan that fits your workflow.
        </p>
      </div>

      <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3">
        <div className="px-4 md:px-0 hidden md:block">
          <h1 className="text-lg md:text-sm text-gray-900 font-semibold">
            Billing history
          </h1>
          <p className="text-gray-600 text-sm">
            Please reach out to our friendly team via billing@untitled.com with
            questions.
          </p>
        </div>

        {/* Invoices table */}
        <div className="md:col-span-2 border-t md:border md:rounded-xl ">
          <Table className="">
            <TableHeader>
              <TableRow className="">
                <TableHead className="bg-gray-50 md:rounded-tl-xl text-gray-600 px-6 text-sm font-medium ">
                  Invoice
                </TableHead>
                <TableHead className="bg-gray-50 md:rounded-tr-xl text-gray-600 px-6 text-sm font-medium text-right">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              <TableRow>
                <TableCell className="p-6 font-medium">
                  Basic plan - Dec
                </TableCell>
                <TableCell className="p-6 text-right">$250.00</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="p-6 font-medium">
                  Basic plan - Nov
                </TableCell>
                <TableCell className="p-6 text-right">$250.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
