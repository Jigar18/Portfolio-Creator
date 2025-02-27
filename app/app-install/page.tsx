"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function InstallAppContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const access_token = searchParams.get("access_token");
  const login = searchParams.get("login");
  const installation_id = searchParams.get("installation_id");

  useEffect(() => {
    if (installation_id) {
      router.push("/dashboard");
      return;
    }
    if (access_token && login) {
      window.location.href = `https://github.com/apps/portfolio-creator/installations/new`;
    } else {
      router.push("/");
    }
  }, [access_token, login, router, installation_id]);

  return <div>Redirecting to install GitHub App...</div>;
}

export default function InstallApp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InstallAppContent />
    </Suspense>
  );
}
