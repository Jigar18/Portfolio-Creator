"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import axios from "axios";

function InstallAppContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const access_token = searchParams.get("access_token");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkInstallation() {
      if (!access_token) {
        router.push("/");
        return;
      } else {
        try {
          const response = await axios.get(
            "https://api.github.com/user/installtions",
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );

          const installations = response.data.installations;

          if (installations.length > 0) {
            router.push("/dashboard");
          } else {
            window.location.href =
              "https://github.com/apps/portfolio-creator/installations/new";
          }
        } catch (error) {
          console.error("Error checking installation:", error);
          router.push("/");
        } finally {
          setLoading(false);
        }
      }
    }
    checkInstallation();
  }, [access_token, router]);

  return (
    <div>{loading ? "Checking installation status..." : "Redirecting..."}</div>
  );
}

export default function InstallApp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InstallAppContent />
    </Suspense>
  );
}
