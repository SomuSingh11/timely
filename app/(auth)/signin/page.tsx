import LoginPage from "@/components/auth/LoginPage";
import { Suspense } from "react";

function LoginFormWrapper() {
  return <LoginPage />;
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      }
    >
      <LoginFormWrapper />
    </Suspense>
  );
}
