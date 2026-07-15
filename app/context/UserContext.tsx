"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useParams } from "next/navigation";

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  jobTitle: string;
  college: string;
  imageUrl: string;
  about?: string;
}

interface UserContextType {
  userDetails: UserDetails | null;
  loading: boolean;
  isOwner: boolean;
  portfolioUsername: string;
  portfolioApiUrl: (path: string) => string;
  updateUserDetails: (details: Partial<UserDetails>) => void;
  refreshUserDetails: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const params = useParams<{ userpage?: string | string[] }>();
  const routeUsername = Array.isArray(params?.userpage)
    ? params.userpage[0]
    : params?.userpage;
  const portfolioUsername = routeUsername ? decodeURIComponent(routeUsername) : "";
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const portfolioApiUrl = useCallback((path: string) => {
    if (!portfolioUsername) return path;
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}username=${encodeURIComponent(portfolioUsername)}`;
  }, [portfolioUsername]);

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(portfolioApiUrl("/api/getUserDetails"), {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.details) {
          setIsOwner(Boolean(data.isOwner));
          setUserDetails({
            firstName: data.details.firstName || "",
            lastName: data.details.lastName || "",
            email: data.details.email || "",
            location: data.details.location || "",
            jobTitle: data.details.jobTitle || "",
            college: data.details.college || "",
            imageUrl: data.details.imageUrl || "",
            about: data.details.about || "",
          });
        }
      } else {
        setUserDetails(null);
        setIsOwner(false);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  }, [portfolioApiUrl]);

  const updateUserDetails = useCallback((details: Partial<UserDetails>) => {
    setUserDetails((prev) => (prev ? { ...prev, ...details } : null));
  }, []);

  const refreshUserDetails = useCallback(async () => {
    await fetchUserDetails();
  }, [fetchUserDetails]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const value: UserContextType = {
    userDetails,
    loading,
    isOwner,
    portfolioUsername,
    portfolioApiUrl,
    updateUserDetails,
    refreshUserDetails,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
