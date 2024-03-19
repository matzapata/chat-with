import GoProButton from "@/components/billing/go-pro-button";
import PortalButton from "@/components/billing/portal-button";
import { Checkbox } from "@/components/ui/checkbox";
import SettingsLayout from "@/layouts/settings-layout";
import { apiService } from "@/lib/services/api-service";
import { paymentsService } from "@/lib/services/payments-service";
import { userService } from "@/lib/services/user-service";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Billing() {
  const { getAccessTokenRaw } = getKindeServerSession();
  const accessTokenRaw = await getAccessTokenRaw();

  // Get all plans and user data
  const [plans, user] = await Promise.all([
    paymentsService.getPlans(),
    userService.get(accessTokenRaw),
  ]);

  return (
    <SettingsLayout user={{ email: user.email, isPro: user.is_pro }}>
      <div className="py-8 md:py-12 space-y-8 max-w-6xl mx-auto">
        {/* Heading */}
        <div className="px-4 md:px-8 space-y-8 ">
          <h1 className="font-semibold text-2xl md:3xl text-gray-900">
            Billing
          </h1>

          <div className=" space-y-1 pb-5 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Account plans
            </h2>
            <p className="text-gray-600">
              Pick an account plan that fits your workflow.
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="px-4 md:px-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="">
            <h2 className=" text-sm font-semibold text-gray-900">
              Current plan
            </h2>
            <p className=" text-sm text-gray-600">
              We’ll credit your account if you need to downgrade during the
              billing cycle.
            </p>
          </div>

          <div className="space-y-4 col-span-2 md:pt-5">
            {/* Plans cards */}
            {Object.values(plans).map((plan) => (
              <PlanCard
                key={plan.variant_id}
                description={plan.description}
                interval={plan.interval}
                name={plan.name}
                price={plan.price}
                selected={user.plan.variant_id === plan.variant_id}
              />
            ))}

            {user.is_pro ? (
              <PortalButton />
            ) : (
              <GoProButton />
            )}
          </div>
        </div>
      </div>
    </SettingsLayout>
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
                ${props.price} / {props.interval}
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
