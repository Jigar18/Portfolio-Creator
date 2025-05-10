"use client";

import { useState, useEffect } from "react";
import { getEmailOrAuthUrl } from "@/lib/githubAuth";
import { Button } from "@/components/ui/button";

interface EmailFetcherProps {
  onEmailFetched?: (email: string) => void;
}

export function EmailFetcher({ onEmailFetched }: EmailFetcherProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  const fetchEmail = async () => {
    setLoading(true);
    setError(null);
    setAuthUrl(null);

    try {
      const result = await getEmailOrAuthUrl();

      if (result.needsAuth && result.authUrl) {
        setAuthUrl(result.authUrl);
      } else if (result.email) {
        setEmail(result.email);
        if (onEmailFetched) onEmailFetched(result.email);
      } else {
        setError("Unable to fetch email");
      }
    } catch (err) {
      setError("An error occurred while fetching your email");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch on initial load
    fetchEmail();
  }, []);

  const handleAuthClick = () => {
    if (authUrl) {
      // Redirect the browser to GitHub auth
      window.location.href = authUrl;
    }
  };

  if (loading) {
    return <div>Loading email...</div>;
  }

  if (authUrl) {
    return (
      <div className="p-4 border rounded-md bg-gray-50">
        <p className="mb-4">
          GitHub permissions are needed to access your email address.
        </p>
        <Button onClick={handleAuthClick}>Grant Permission</Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-md bg-red-50">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchEmail} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (email) {
    return (
      <div className="p-4 border rounded-md bg-green-50">
        <p>
          Email: <strong>{email}</strong>
        </p>
      </div>
    );
  }

  return null;
}
