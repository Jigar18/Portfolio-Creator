"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FileUp, Check, X } from "lucide-react";

interface FormValues {
  title: string;
  description: string;
  fileInput: FileList;
}

interface Card {
  title: string;
  pdfUrl: string;
  description: string;
}
//
export default function EditCertifications({
  onAddCard,
}: {
  onAddCard: (card: Card) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>();
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const selectedFile = watch("fileInput");

  const onSubmit = async (data: FormValues) => {
    try {
      setIsUploading(true);

      if (!data.fileInput || !data.fileInput[0]) {
        throw new Error("File is not selected");
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("pdf", data.fileInput[0]);
      
      const response = await fetch("/api/uploadCertificate", {
          method: "POST",
          body: formData,
        });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const responseData = await response.json();

      const newCard = {
        title: data.title,
        description: data.description,
        pdfUrl: responseData.pdfUrl,
      };
      
      const apiResponse = await fetch("/api/certificateToDB", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({card: newCard}),
        });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({ error: `HTTP ${apiResponse.status}` }));
        throw new Error(errorData.error || `Database save failed with status ${apiResponse.status}`);
      }

      console.log("Certificate saved to database successfully");

      // Add the new card using the callback
      onAddCard(newCard);

      reset();
      setOpen(false);
    } catch (error) {
      console.error("Error during form submission:", error);
      // You might want to show a toast notification here
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsUploading(false);
    }
  };
//Error: Error: Upload failed: new row violates row-level security policy
  const getFileName = () => {
    if (selectedFile && selectedFile[0]) {
      const name = selectedFile[0].name;
      if (name.length > 25) {
        return name.substring(0, 22) + "...";
      }
      return name;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md transition-colors flex items-center gap-2">
          <FileUp className="h-4 w-4" />
          Add Certificates
        </Button>
      </DialogTrigger>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full sm:max-w-[600px] bg-slate-900 text-slate-100 z-[60] rounded-xl border border-slate-800 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-2xl font-bold text-slate-100">
              Add Certificate
            </DialogTitle>
            <p className="text-slate-400 text-sm mt-1.5">
              Add a new certificate to your portfolio and provide its details.
            </p>
          </DialogHeader>
          <div className="space-y-6 py-6 px-6">
            {/* Title Input */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-slate-300 font-medium text-sm block"
              >
                Certificate Title
              </Label>
              <Input
                id="title"
                placeholder="e.g. AWS Solutions Architect"
                className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200"
                {...register("title", {
                  required: "Title is required",
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-slate-300 font-medium text-sm block"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Briefly describe what this certificate is about..."
                className="w-full px-4 py-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200 resize-none min-h-[120px]"
                {...register("description", {
                  required: "Description is required",
                  validate: (value) =>
                    value.split(/\s+/).length <= 300 ||
                    "Maximum 300 words allowed",
                })}
              />
              {errors.description ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              ) : (
                <p className="text-slate-500 text-xs mt-1">Maximum 300 words</p>
              )}
            </div>

            {/* File Input */}
            <div className="space-y-2">
              <Label
                htmlFor="fileInput"
                className="text-slate-300 font-medium text-sm block"
              >
                Upload Certificate (PDF)
              </Label>
              <div className="relative">
                <Input
                  id="fileInput"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  {...register("fileInput", {
                    required: "PDF file is required",
                  })}
                />
                <div
                  className={`w-full px-4 py-3 border border-dashed ${
                    selectedFile && selectedFile[0]
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-600 bg-slate-800"
                  } rounded-md cursor-pointer flex items-center justify-center h-20 hover:bg-slate-700/50 transition-colors`}
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  {selectedFile && selectedFile[0] ? (
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-400" />
                      <span className="text-slate-200">{getFileName()}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          reset({ fileInput: undefined });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <FileUp className="h-6 w-6 text-blue-400" />
                      <span className="text-slate-400 text-sm">
                        Click to select PDF
                      </span>
                    </div>
                  )}
                </div>
                {errors.fileInput && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fileInput.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="px-6 pb-6 bg-slate-900 border-t border-slate-800 mt-2 pt-4 flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-transparent hover:bg-slate-800 text-slate-300 border border-slate-700 px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md transition-colors flex items-center gap-2"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Add Certificate</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
