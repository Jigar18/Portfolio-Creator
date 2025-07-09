"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

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
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/getUserDetails", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.details) {
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
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserDetails = useCallback((details: Partial<UserDetails>) => {
    setUserDetails((prev) => (prev ? { ...prev, ...details } : null));
  }, []);

  const refreshUserDetails = useCallback(async () => {
    await fetchUserDetails();
  }, [fetchUserDetails]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const value: UserContextType = {
    userDetails,
    loading,
    updateUserDetails,
    refreshUserDetails,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
