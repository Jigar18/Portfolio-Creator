"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AppInstalled() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const installation_id = searchParams.get("installation_id");

  useEffect(() => {
    if (installation_id) {
      console.log("GitHub App installed with ID:", installation_id);
      setTimeout(() => {
        router.push("/details");
      }, 3000);
    } else {
      router.push("/");
    }
  }, [installation_id, router]);

  return <div>✅ GitHub App installed! Redirecting...</div>;
}

export default function AppInstalledPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AppInstalled />
        </Suspense>
    )
}