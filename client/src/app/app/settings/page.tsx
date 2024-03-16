import EmailForm from "@/components/settings/email-form";
import NameForm from "@/components/settings/name-form";
import SettingsLayout from "@/layouts/settings-layout";
import { apiService } from "@/lib/services/api-service";
import { userService } from "@/lib/services/user-service";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Profile() {
  const { getAccessTokenRaw } = getKindeServerSession();
  apiService.setAccessToken(await getAccessTokenRaw());

  const user = await userService.get();

  return (
    <SettingsLayout user={{ email: user.email, isPro: user.is_pro }}>
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
            <NameForm name={user.name} />

            {/* Email */}
            <EmailForm email={user.email} />
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
