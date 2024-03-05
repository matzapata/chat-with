import Navbar from "@/components/navbar/app";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>
        <Navbar />
        {children}
      </main>
    </div>
  );
}
