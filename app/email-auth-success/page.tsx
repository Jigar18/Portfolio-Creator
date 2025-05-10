"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmailAuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect back to the original page after a brief delay
    const timer = setTimeout(() => {
      // Since we can't access the returnTo cookie directly from client side,
      // we'll just redirect to a common page like dashboard
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Email Access Granted!</h1>

        <div className="mb-6 text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <p className="mb-6">
          You have successfully granted permission to access your email address.
          You can now close this window or you will be redirected automatically.
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
