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

export default function EditCertifications() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Submitting data:", data);
      if (!data.fileInput || !data.fileInput[0]) {
        throw new Error("File is not selected");
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("file", data.fileInput[0]);

      console.log({
        title: data.title,
        description: data.description,
        fileName: data.fileInput[0]?.name,
      });

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
      <DialogContent className="sm:max-w-[600px] bg-white text-black">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Raw form submitted!");
          }}
        >
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
            {/* <DialogFooter className="px-6 pb-6"> */}
              <Button type="submit" className="px-6 pb-6">Save changes</Button>
            {/* </DialogFooter> */}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const cards = [
  {
    title: "Summertime Sadness",
    src: "/tab-icon.png",
    description: (
      <p>
        Lana Del Rey, an iconic American singer-songwriter, is celebrated for
        her melancholic and cinematic music style. Born Elizabeth Woolridge
        Grant in New York City, she has captivated audiences worldwide with her
        haunting voice and introspective lyrics. <br /> <br /> Her songs often
        explore themes of tragic romance, glamour, and melancholia, drawing
        inspiration from both contemporary and vintage pop culture. With a
        career that has seen numerous critically acclaimed albums, Lana Del Rey
        has established herself as a unique and influential figure in the music
        industry, earning a dedicated fan base and numerous accolades.
      </p>
    ),
  },
  {
    title: "Mitran Di Chhatri",
    src: "/tab-icon.png",
    description: (
      <p>
        Babu Maan, a legendary Punjabi singer, is renowned for his soulful voice
        and profound lyrics that resonate deeply with his audience. Born in the
        village of Khant Maanpur in Punjab, India, he has become a cultural icon
        in the Punjabi music industry. <br /> <br /> His songs often reflect the
        struggles and triumphs of everyday life, capturing the essence of
        Punjabi culture and traditions. With a career spanning over two decades,
        Babu Maan has released numerous hit albums and singles that have
        garnered him a massive fan following both in India and abroad.
      </p>
    ),
  },
];
