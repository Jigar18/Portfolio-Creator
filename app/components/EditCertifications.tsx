import { Button } from "@/components/ui/button";
// import { promises as fs } from "node:fs";
// import { pdf } from "pdf-to-img";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";

export default function EditCertifications() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  async function handleSubmit() {
    let counter = 1;
    const document = await pdf("example.pdf", { scale: 3 });
    for await (const image of document) {
      await fs.writeFile(`page${counter}.png`, image);
      counter++;
    }

    // you can also read a specific page number:
    const page12buffer = await document.getPage(12);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Certificates</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white text-black">
        <DialogHeader>
          <DialogTitle>Add Certificate</DialogTitle>
          <DialogDescription className="text-gray-500">
            Add a new certificate to your profile and give an appropriate
            description.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4 px-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-medium">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Certificate name"
              className="col-span-3"
            />
          </div>
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
              maxLength={300}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="upload" className="text-right font-medium">
              Upload PDF
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                ref={fileInputRef}
                id="upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
              {selectedFile && (
                <span className="text-sm text-gray-500">
                  {selectedFile.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="px-6 pb-6">
          <DialogClose asChild>
            <Button type="button" onClick={handleSubmit}>
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
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
