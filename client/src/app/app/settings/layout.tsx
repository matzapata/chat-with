import Link from "next/link";

const subNavbarItems = [
  { label: "General", href: "/app/settings" },
  { label: "Billing", href: "/app/settings/billing" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {/* Submenu */}
      <div className="border-b border-b-gray-200 flex justify-center">
        <div className="px-2 md:px-6 max-w-6xl w-full flex py-3 items-center">
          {subNavbarItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="px-3 py-1 text-md font-semibold text-gray-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {children}
    </main>
  );
}
