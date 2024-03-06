import Link from "next/link";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Submenu */}
      <div className="border-b border-b-gray-200 flex justify-center">
        <div className="px-8 max-w-6xl w-full flex py-3 items-center">
          <Link
            href={"/app/chat"}
            className="px-3 py-1 text-md font-semibold text-gray-700"
          >
            Filename.txt
          </Link>

          <Link
            href={"/app/chat/documents"}
            className="px-3 py-1 text-md font-semibold text-gray-700"
          >
            Documents
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
