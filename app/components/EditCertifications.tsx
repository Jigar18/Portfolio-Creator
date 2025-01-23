"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface FormValues {
  title: string;
  description: string;
  fileInput: FileList;
}

interface Card {
  title: string;
  pdf: string;
  description: string;
}

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
  } = useForm<FormValues>();
  const [open, setOpen] = useState(false);

  const onSubmit = (data: FormValues) => {
    try {
      if (!data.fileInput || !data.fileInput[0]) {
        throw new Error("File is not selected");
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("pdf", data.fileInput[0]);

      const newCard = {
        title: data.title,
        description: data.description,
        pdf: data.fileInput[0].name,
      };

      fetch("/api/uploadPDF", { method: "POST", body: formData });

      // Add the new card using the callback
      onAddCard(newCard);
      console.log("New card added:", newCard);

      // Reset form and close dialog
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Certificates</Button>
      </DialogTrigger>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full sm:max-w-[600px] bg-white text-black z-[60] rounded-lg">
        <div aria-hidden="true" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Certificate</DialogTitle>
            <DialogDescription className="text-gray-500">
              Add a new certificate to your profile and give an appropriate
              description.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4 px-6">
            {/* Title Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right font-medium">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Certificate name"
                className="col-span-3"
                {...register("title", {
                  required: "Title is required",
                })}
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description Input */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label
                htmlFor="description"
                className="text-right font-medium pt-2"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter certificate description (max 300 words)"
                className="col-span-3 resize-none min-h-[120px] max-h-[200px] overflow-auto"
                {...register("description", {
                  required: "Description is required",
                  validate: (value) =>
                    value.split(/\s+/).length <= 300 ||
                    "Maximum 300 words allowed",
                })}
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* File Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fileInput" className="text-right font-medium">
                Upload PDF
              </Label>
              <div className="col-span-3">
                <Input
                  id="fileInput"
                  type="file"
                  accept="application/pdf"
                  className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  {...register("fileInput", {
                    required: "PDF file is required",
                  })}
                />
                {errors.fileInput && (
                  <p className="text-red-500">{errors.fileInput.message}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="px-6 pb-6">
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
