import AppLayout from "@/layouts/app-layout";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout
      items={[]}
      nestedItems={[
        {
          link: "/app/settings",
          title: "General",
        },
        {
          link: "/app/settings/billing",
          title: "Billing",
        },
      ]}
    >
      {children}
    </AppLayout>
  );
}
