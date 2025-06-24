"use client";

import type { ChangeEvent, DragEvent } from "react";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createPortal } from "react-dom";

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageChange: (imageUrl: string) => void;
  currentImage: string;
}

export default function ProfileImageModal({
  isOpen,
  onClose,
  onImageChange,
  currentImage,
}: ProfileImageModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setSelectedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setSelectedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      onClose();
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile, "profile-picture.jpg");

      const uploadResponse = await fetch("/api/uploadProfilePicture", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await uploadResponse.json();
      const imageUrl = result.imageUrl;

      if (imageUrl) {
        onImageChange(imageUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
        setSelectedImage(null);
        onClose();
      } else {
        console.error("Upload failed: No image URL returned");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedImage(null);
      setIsUploading(false);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
          onClick={onClose}
          aria-label="Close modal"
          size="icon"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <span className="bg-blue-600/20 p-1.5 rounded text-blue-400">
              <Camera className="h-5 w-5" />
            </span>
            Change Profile Picture
          </h2>

          {/* Current image preview */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700">
              <Image
                src={previewUrl || selectedImage || currentImage}
                alt="-"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Upload section */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 mb-6 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-500/10"
                : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="profile-image-upload"
            />
            <label
              htmlFor="profile-image-upload"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="p-3 rounded-full bg-slate-700">
                <Upload className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-slate-300 font-medium">Upload a photo</p>
              <p className="text-slate-500 text-sm">
                Drag and drop or click to browse
              </p>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
              className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedFile || isUploading}
              className={`bg-blue-600 hover:bg-blue-700 text-white ${
                !selectedFile || isUploading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
