import Login from "@/features/auth/components/Login";
import Register from "@/features/auth/components/Register";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1f1f1f] px-6 py-10">
      <div className="flex w-full max-w-6xl flex-col gap-8 md:flex-row items-start justify-center">
        <div className="mx-auto md:mx-0">
          <Login />
        </div>

        <div className="mx-auto md:mx-0">
          <Register />
        </div>
      </div>
    </div>
  );
}
