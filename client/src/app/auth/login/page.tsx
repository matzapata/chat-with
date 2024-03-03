import Navbar from "@/components/navbar/landing";

export default function Login() {
  return (
    <div>
      <Navbar />

      <div className="py-12">
        <div className="space-y-2 text-center">
          <h1 className="text-gray-900 text-2xl font-semibold">Log in to your account</h1>
          <p className="text-gray-600">Welcome back! Please enter your details.</p>
        </div>
      </div>
    </div>
  );
}
