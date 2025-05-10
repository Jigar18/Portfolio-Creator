"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmailFetcher } from "@/app/components/EmailFetcher";

export default function EmailFetchDemo() {
  const [showFetcher, setShowFetcher] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const handleEmailFetched = (email: string) => {
    setEmail(email);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md">
      <h1 className="text-2xl font-bold mb-4">Email Fetch Demo</h1>

      {!showFetcher ? (
        <Button onClick={() => setShowFetcher(true)}>Fetch My Email</Button>
      ) : (
        <div>
          <EmailFetcher onEmailFetched={handleEmailFetched} />

          {email && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p>
                Successfully fetched email: <strong>{email}</strong>
              </p>
            </div>
          )}

          <Button
            onClick={() => setShowFetcher(false)}
            variant="outline"
            className="mt-4"
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}
