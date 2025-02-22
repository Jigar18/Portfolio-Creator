"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const githubAppSlug = "portfolio-creator";

export default function InstallApp() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const access_token = searchParams.get("access_token");
  const login = searchParams.get("login");

  useEffect(() => {
    if (access_token && login) {
      window.location.href = `https://github.com/apps/${githubAppSlug}/installations/new`;
    } else {
      router.push("/");
    }
  }, [access_token, login, router]);

  return <div>Redirecting to install GitHub App...</div>;
}
