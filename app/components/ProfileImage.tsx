"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import ProfileImageModal from "./ProfileImageModal";
import { supabase } from "@/utils/uploadImage";
import { jwtVerify } from "jose";

export default function ProfileImage() {
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "."
  );

  const handleImageChange = (newImageUrl: string) => {
    setProfileImage(newImageUrl);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getProfileImage = async () => {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
      };

      const token = getCookie("id&Uname");

      if (!token) {
        console.error("Authentication token is missing");
        return;
      }

      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!)
        );
        const userId = payload.userId as string;
        const { data, error } = await supabase
          .from("Details")
          .select("imageUrl")
          .eq("userId", userId);

        if (error) {
          console.error("Error fetching profile image final page:", error);
          return;
        }

        if (data && data[0]?.imageUrl) {
          setProfileImage(data[0].imageUrl);
        }
      } catch (error) {
        console.error("JWT verification failed:", error);
      }
    };

    getProfileImage();
  }, []);

  return (
    <>
      <motion.div
        {...{ className: "relative" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-slate-700 relative z-10">
          <Image
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            width={200}
            height={200}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute inset-0 rounded-full blur-xl "></div>

        {/* Edit button that appears on hover */}
        <motion.button
          {...{
            className:
              "absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full z-20 shadow-lg border-2 border-slate-700 cursor-pointer",
            onClick: (e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              setIsModalOpen(true);
            },
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
          aria-label="Edit profile picture"
        >
          <Camera size={16} />
        </motion.button>
      </motion.div>

      {/* Profile Image Modal */}
      <ProfileImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageChange={handleImageChange}
        currentImage={profileImage}
      />
    </>
  );
}
