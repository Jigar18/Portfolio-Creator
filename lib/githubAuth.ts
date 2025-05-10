/**
 * Helper function to fetch user email, handling GitHub OAuth flow if necessary.
 * This should be called from the client-side code.
 */
export async function fetchUserEmail(): Promise<{ email: string } | null> {
  try {
    // First attempt to get the email
    const response = await fetch("/api/emailFetch");
    const data = await response.json();

    // If we need authorization, handle that first
    if (!response.ok && data.needsAuth && data.authUrl) {
      // This should be a client-side redirect, not a fetch call
      window.location.href = data.authUrl;
      return null; // Will redirect, so return null
    }

    // Normal success case
    if (response.ok && data.email) {
      return { email: data.email };
    }

    console.error("Error fetching email:", data.error);
    return null;
  } catch (error) {
    console.error("Error in fetchUserEmail:", error);
    return null;
  }
}

/**
 * Alternative method that returns auth URL instead of redirecting.
 * This gives more control to the caller on how to handle the auth flow.
 */
export async function getEmailOrAuthUrl(): Promise<{
  email?: string;
  needsAuth: boolean;
  authUrl?: string;
}> {
  try {
    const response = await fetch("/api/emailFetch");
    const data = await response.json();

    if (!response.ok && data.needsAuth && data.authUrl) {
      return {
        needsAuth: true,
        authUrl: data.authUrl,
      };
    }

    if (response.ok && data.email) {
      return {
        email: data.email,
        needsAuth: false,
      };
    }

    console.error("Error fetching email:", data.error || "Unknown error");
    return { needsAuth: false };
  } catch (error) {
    console.error("Error in getEmailOrAuthUrl:", error);
    return { needsAuth: false };
  }
}
