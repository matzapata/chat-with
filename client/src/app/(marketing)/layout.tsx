import Faq from "@/components/faq";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar/landing";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
      
      <Faq />
      <Footer />
    </div>
  );
}
