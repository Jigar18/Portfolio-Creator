"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Upload, Check, Loader2 } from "lucide-react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const globalStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #1e293b inset !important;
    -webkit-text-fill-color: #e2e8f0 !important;
    transition: background-color 5000s ease-in-out 0s;
    caret-color: #e2e8f0;
  }
  
  /* Custom styles for ReactCrop */
  .ReactCrop {
    position: relative;
    max-width: 400px;
    max-height: 400px;
    margin: 0 auto;
  }
  
  .ReactCrop__crop-selection {
    border-radius: 50% !important;
    box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.7);
  }
  
  /* Ensure buttons stay visible during cropping */
  .crop-buttons {
    position: relative;
    z-index: 1000;
    backdrop-filter: blur(10px);
    border-radius: 0.5rem;
    padding: 1rem;
    }
    `;
    // border: 1px solid rgba(51, 65, 85, 0.5);
    // background: rgba(15, 23, 42, 0.9);

export default function ProfilePicturePage() {
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
          setCroppedImage(null);
          setUploadSuccess(false);
          setIsCropping(true);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = useCallback((img: HTMLImageElement) => {
    imgRef.current = img;

    // Make the crop a perfect circle in the center
    const minSize = Math.min(img.width, img.height);
    const x = (img.width - minSize) / 2;
    const y = (img.height - minSize) / 2;

    const initialCrop = {
      unit: "px" as const,
      width: minSize,
      height: minSize,
      x,
      y,
    };

    setCrop(initialCrop);
    setCompletedCrop(initialCrop);

    return false;
  }, []);

  const getCroppedImg = useCallback(() => {
    if (!imgRef.current || !completedCrop) return null;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Draw circular crop
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.clip();

    // Draw the image
    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    ctx.drawImage(
      imgRef.current,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      outputSize,
      outputSize
    );

    const base64Image = canvas.toDataURL("image/jpeg");
    return base64Image;
  }, [completedCrop]);

  const handleCropComplete = (crop: Crop) => {
    setCompletedCrop(crop);
  };

  const handleDone = () => {
    const cropToUse = completedCrop || crop;

    if (!imgRef.current || !cropToUse) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.clip();

    const cropX = cropToUse.x * scaleX;
    const cropY = cropToUse.y * scaleY;
    const cropWidth = cropToUse.width * scaleX;
    const cropHeight = cropToUse.height * scaleY;

    ctx.drawImage(
      imgRef.current,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      outputSize,
      outputSize
    );

    // Convert to base64
    const base64Image = canvas.toDataURL("image/jpeg");

    if (base64Image) {
      setCroppedImage(base64Image);
      setIsCropping(false);
    }
  };

  const handleRecrop = () => {
    setIsCropping(true);
    setCroppedImage(null);
  };

  const handleCancel = () => {
    setImage(null);
    setCroppedImage(null);
    setIsCropping(false);
  };

  const handleSubmit = async () => {
    if (!croppedImage) return;

    setIsUploading(true);

    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("image", blob, "profile-picture.jpg");

      const uploadResponse = await fetch("/api/uploadFile", {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        setUploadSuccess(true);
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <style jsx global>
        {globalStyles}
      </style>

      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-800">
          <div className="p-8">
            <div className="mb-12 text-center">
              <h1 className="text-3xl font-bold text-slate-100 mb-3">
                {"Add your profile picture"}
              </h1>
              <p className="text-slate-400 max-w-md mx-auto">
                Upload a profile picture to personalize your portfolio. A
                professional headshot works best.
              </p>
            </div>

            <div className="space-y-8 max-w-xl mx-auto">
              {/* Profile picture input */}
              <div className="flex flex-col items-center">
                <Label className="text-slate-300 font-medium text-base mb-6 block">
                  Select an image
                </Label>

                {!image ? (
                  <motion.div
                    {...{
                      className:
                        "w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden relative",
                      onClick: handleImageClick,
                      onMouseEnter: () => setIsHovering(true),
                      onMouseLeave: () => setIsHovering(false),
                      whileHover: { borderColor: "#3b82f6" },
                    }}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <motion.div
                      {...{
                        className:
                          "flex flex-col items-center justify-center text-slate-400",
                      }}
                      animate={{ opacity: isHovering ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Upload className="h-12 w-12 mb-3" />
                      <p className="text-sm">Click to upload</p>
                    </motion.div>

                    <motion.div
                      {...{
                        className:
                          "absolute inset-0 flex items-center justify-center",
                      }}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{
                        y: isHovering ? 0 : 100,
                        opacity: isHovering ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <div className="bg-blue-600/20 rounded-full p-6">
                        <User className="h-16 w-16 text-blue-400" />
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {isCropping ? (
                      <div className="max-w-md mx-auto">
                        <ReactCrop
                          crop={crop}
                          onChange={(c) => setCrop(c)}
                          onComplete={handleCropComplete}
                          circularCrop
                          aspect={1}
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt="Upload preview"
                            onLoad={(e) => onImageLoad(e.currentTarget)}
                            className="max-w-full"
                          />
                        </ReactCrop>
                        <div className="mt-6 flex justify-center">
                          <div className="crop-buttons flex space-x-4">
                            <button
                              onClick={handleCancel}
                              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleDone}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-2 border-blue-500">
                          <img
                            src={croppedImage || "/placeholder.svg"}
                            alt="Cropped preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="mt-6 flex justify-center space-x-4">
                          <button
                            onClick={handleRecrop}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
                          >
                            Crop Image
                          </button>
                          <button
                            onClick={handleSubmit}
                            disabled={isUploading || uploadSuccess}
                            className={`px-6 py-2.5 rounded-md transition-colors flex items-center ${
                              isUploading || uploadSuccess
                                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : uploadSuccess ? (
                              <>
                                <Check className="h-5 w-5 mr-2" />
                                Uploaded Successfully
                              </>
                            ) : (
                              "Save Profile Picture"
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Instructions */}
              {image && isCropping && (
                <div className="text-center text-slate-400 text-sm">
                  <p>
                    Drag to adjust the crop area. The image will be cropped to a
                    circle.
                  </p>
                </div>
              )}

              {/* Success message */}
              {uploadSuccess && (
                <div className="mt-6 text-center">
                  <p className="text-green-400">
                    Your profile picture has been uploaded successfully!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
