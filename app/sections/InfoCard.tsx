"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CurrentOrganization from "../components/CurrentOrganization";
import NameBlock from "../components/NameBlock";
import ProfileImage from "../components/ProfileImage";
import {
  Edit3,
  X,
  Save,
  User,
  Mail,
  MapPin,
  Briefcase,
  Building,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import ProfileImageModal from "../components/ProfileImageModal";

function InfoCard() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://xspywcumjzcpwltlhxyi.supabase.co/storage/v1/object/public/profil2e-picture/user-image/undefined-1748901528446-profile-picture.jpg"
  );

  // User details state
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    jobTitle: "",
    college: "",
    imageUrl: "",
  });

  // Temporary form state
  const [tempDetails, setTempDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    jobTitle: "",
    college: "",
  });

  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const [tempImagePreview, setTempImagePreview] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    fetchUserDetails();
    return () => setMounted(false);
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch("/api/getUserDetails");
      const data = await response.json();

      if (data.success && data.details) {
        const details = {
          firstName: data.details.firstName || "",
          lastName: data.details.lastName || "",
          email: data.details.email || "",
          location: data.details.location || "",
          jobTitle: data.details.jobTitle || "",
          college: data.details.college || "",
          imageUrl: data.details.imageUrl || "",
        };
        setUserDetails(details);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleImageEditModal = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsModalOpen(true);
  }

  const handleOpenModal = () => {
    setTempDetails({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      location: userDetails.location,
      jobTitle: userDetails.jobTitle,
      college: userDetails.college,
    });
    setTempImagePreview(userDetails.imageUrl);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setTempDetails({
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      jobTitle: "",
      college: "",
    });
    setTempImageFile(null);
    setTempImagePreview("");
    setIsEditModalOpen(false);
  };

  const handleImageChange = (newImageUrl: string) => {
    setProfileImage(newImageUrl);
    setIsModalOpen(false);
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      // Upload new profile image if selected
      let newImageUrl = userDetails.imageUrl;
      if (tempImageFile) {
        const formData = new FormData();
        formData.append("profilePicture", tempImageFile);

        const imageResponse = await fetch("/api/uploadProfilePicture", {
          method: "POST",
          body: formData,
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          newImageUrl = imageData.imageUrl;
        }
      }

      // Update user details
      const response = await fetch("/api/updateUserDetails", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...tempDetails,
          imageUrl: newImageUrl,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUserDetails((prev) => ({
          ...prev,
          ...tempDetails,
          imageUrl: newImageUrl,
        }));
        handleCloseModal();
        // Trigger a page refresh to update all components
        window.location.reload();
      } else {
        console.error("Failed to update user details:", data.error);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <motion.div
        {...{
          className:
            "w-full rounded-xl bg-slate-800/50 border border-slate-700 shadow-lg p-6 sm:p-8 backdrop-blur-sm relative group",
        }}
        whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        {/* Edit Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-700/80 hover:bg-slate-600 text-slate-300 hover:text-white border border-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
          onClick={handleOpenModal}
          type="button"
          title="Edit profile information"
        >
          <Edit3 className="h-4 w-4" />
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ProfileImage />
            <NameBlock />
          </div>
          <CurrentOrganization />
        </div>
      </motion.div>

      {/* Edit Modal */}
      {mounted &&
        isEditModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <div
              className="relative w-full max-w-2xl bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-200"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close button */}
              <Button
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                onClick={handleCloseModal}
                aria-label="Close modal"
                size="icon"
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                  <span className="bg-blue-900/20 p-1.5 rounded text-blue-400">
                    <Edit3 className="h-5 w-5" />
                  </span>
                  Edit Profile Information
                </h2>

                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {/* Profile Image Section */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 font-medium flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Profile Picture
                    </Label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-600">
                        <Image
                          src={
                            tempImagePreview ||
                            userDetails.imageUrl ||
                            "/placeholder.svg"
                          }
                          alt="Profile Preview"
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        {/* <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="profile-image-input"
                        /> */}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleImageEditModal}
                          className="bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300 hover:text-slate-100"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Change Picture
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-slate-300 font-medium flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={tempDetails.firstName}
                        onChange={(e) =>
                          setTempDetails((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-slate-300 font-medium"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={tempDetails.lastName}
                        onChange={(e) =>
                          setTempDetails((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-slate-300 font-medium flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={tempDetails.email}
                      onChange={(e) =>
                        setTempDetails((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Job Title */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="jobTitle"
                      className="text-slate-300 font-medium flex items-center gap-2"
                    >
                      <Briefcase className="h-4 w-4" />
                      Job Title
                    </Label>
                    <Input
                      id="jobTitle"
                      value={tempDetails.jobTitle}
                      onChange={(e) =>
                        setTempDetails((prev) => ({
                          ...prev,
                          jobTitle: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className="text-slate-300 font-medium flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={tempDetails.location}
                      onChange={(e) =>
                        setTempDetails((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200"
                      placeholder="City, Country"
                    />
                  </div>

                  {/* College/Organization */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="college"
                      className="text-slate-300 font-medium flex items-center gap-2"
                    >
                      <Building className="h-4 w-4" />
                      College/Organization
                    </Label>
                    <Input
                      id="college"
                      value={tempDetails.college}
                      onChange={(e) =>
                        setTempDetails((prev) => ({
                          ...prev,
                          college: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200"
                      placeholder="e.g., University of Technology"
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveChanges}
                    disabled={
                      saving || !tempDetails.firstName || !tempDetails.lastName
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
            <ProfileImageModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onImageChange={handleImageChange}
              currentImage={profileImage}
            />,
          </div>,
          document.body
        )}
    </>
  );
}

export default InfoCard;
