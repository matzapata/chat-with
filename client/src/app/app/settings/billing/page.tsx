import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";

export default function Billing() {
  return (
    <div className="py-8 md:py-12 space-y-8 max-w-6xl mx-auto">
      {/* Heading */}
      <div className="px-4 md:px-8 md:space-y-8 ">
        <div>
          <h1 className="font-semibold text-2xl md:3xl text-gray-900">
            Billing
          </h1>
          <p className="text-gray-600 md:hidden">
            Manage your billing and payment details.
          </p>
        </div>

        <div className="hidden md:block space-y-1 pb-5 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Account plans</h2>
          <p className="text-gray-600">
            Pick an account plan that fits your workflow.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="px-4 md:px-8 md:grid md:grid-cols-3">
        <div className="hidden md:block">
          <h2 className=" text-sm font-semibold text-gray-900">Current plan</h2>
          <p className=" text-sm text-gray-600">
            We’ll credit your account if you need to downgrade during the
            billing cycle.
          </p>
        </div>

        <div className="space-y-4 col-span-2">
          {/* Plans cards */}
          <PlanCard selected />
          <PlanCard />
          <PlanCard />

          <Button variant="secondary-gray" size="sm">
            Manage
          </Button>
        </div>
      </div>

      {/* Billing history */}
      <div className="md:px-8 md:space-y-6">
        <div className="hidden md:block space-y-1 pb-5 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Billing and invoicing
          </h2>
          <p className="text-gray-600">
            Pick an account plan that fits your workflow.
          </p>
        </div>

        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3">
          <div className="px-4 md:px-0">
            <h1 className="text-lg md:text-sm text-gray-900 font-semibold">
              Billing history
            </h1>
            <p className="text-gray-600 text-sm hidden md:block">
              Please reach out to our friendly team via billing@untitled.com
              with questions.
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
    </div>
  );
}

function PlanCard({ selected }: { selected?: boolean }) {
  return (
    <div
      className={`${
        selected ? "border-brand-600 border-[2px]" : "border"
      } rounded-xl`}
    >
      <div
        className={`${
          selected
            ? "border-b-[2px] md:border-b-0 border-brand-600"
            : "border-b"
        } flex items-center p-4`}
      >
        <div className="flex flex-grow space-x-4 items-center">
          <div className="h-7 w-7 bg-brand-100 border-4 border-brand-50 rounded-full"></div>
          <div className="">
            <h2 className="font-semibold md:font-medium md:text-sm text-gray-700">
              Basic plan{" "}
              <span className="text-gray-600 hidden md:inline-block">
                $10 per month
              </span>
            </h2>
            <p className="text-gray-600 md:text-sm hidden md:block">
              Includes up to 10 users, 20GB individual data and access to all
              features.
            </p>
          </div>
        </div>
        <Checkbox
          checked={selected}
          className="text-brand-600 border-gray-200 rounded"
        />
      </div>

      <div className="p-4 space-y-1 md:hidden">
        <div>
          <span className="text-gray-700 text-3xl font-semibold">$10</span>
          <span className="text-gray-600 ml-1">per month</span>
        </div>
        <p className="text-gray-600">
          Includes up to 10 users, 20GB individual data and access to all
          features.
        </p>
      </div>
    </div>
  );
}
