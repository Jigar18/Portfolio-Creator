"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Camera } from "lucide-react";
import ProfileImageModal from "./ProfileImageModal";
import { useUser } from "../context/UserContext";

export default function ProfileImage() {
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userDetails, refreshUserDetails } = useUser();

  const handleImageChange = async (newImageUrl: string) => {
    await refreshUserDetails();
    setIsModalOpen(false);
  };

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
            src={userDetails?.imageUrl || "/placeholder.png"}
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
        currentImage={userDetails?.imageUrl || ""}
      />
    </>
  );
}
