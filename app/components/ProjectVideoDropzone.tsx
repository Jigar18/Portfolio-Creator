"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Film, LoaderCircle, UploadCloud, X } from "lucide-react";

export interface ProjectVideo {
  videoUrl: string;
  videoPublicId: string;
  videoDuration: number;
  videoBytes: number;
  videoFormat: string;
}

interface ProjectVideoDropzoneProps {
  video?: ProjectVideo | null;
  onUploaded: (video: ProjectVideo) => Promise<void> | void;
  onRemove?: () => Promise<void> | void;
  disabled?: boolean;
}

const MAX_VIDEO_BYTES = 20 * 1024 * 1024;
const MAX_VIDEO_DURATION = 120;

export async function removeUnsavedProjectVideo(publicId: string) {
  await fetch("/api/cloudinary/video", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ publicId }),
  });
}

function readDuration(file: File) {
  return new Promise<number>((resolve, reject) => {
    const previewUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(previewUrl);
      Number.isFinite(video.duration) ? resolve(video.duration) : reject(new Error("Unable to read the video duration"));
    };
    video.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error("This video could not be read"));
    };
    video.src = previewUrl;
  });
}

export default function ProjectVideoDropzone({ video, onUploaded, onRemove, disabled }: ProjectVideoDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const showToast = (message: string, success = false) => {
    setToast({ message, success });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  const uploadFile = async (file?: File) => {
    if (!file || uploading || disabled) return;
    if (file.size > MAX_VIDEO_BYTES) {
      showToast("The video file size should not be greater than 20 MB.");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !["mp4", "webm"].includes(extension)) {
      showToast("Upload an MP4 or WebM video.");
      return;
    }

    setUploading(true);
    try {
      const duration = await readDuration(file);
      if (duration > MAX_VIDEO_DURATION) throw new Error("The project demo should not be longer than 2 minutes.");

      const signatureResponse = await fetch("/api/cloudinary/video-signature", { method: "POST", credentials: "include" });
      const signatureData = await signatureResponse.json();
      if (!signatureResponse.ok) throw new Error(signatureData.error || "Unable to prepare the video upload");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signatureData.apiKey);
      formData.append("folder", signatureData.folder);
      formData.append("timestamp", String(signatureData.timestamp));
      formData.append("upload_preset", signatureData.uploadPreset);
      formData.append("signature", signatureData.signature);

      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/video/upload`, {
        method: "POST",
        body: formData,
      });
      const result = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(result.error?.message || "Cloudinary could not upload the video");

      const uploadedVideo: ProjectVideo = {
        videoUrl: result.secure_url,
        videoPublicId: result.public_id,
        videoDuration: result.duration,
        videoBytes: result.bytes,
        videoFormat: result.format,
      };
      if (
        result.resource_type !== "video" ||
        uploadedVideo.videoBytes > MAX_VIDEO_BYTES ||
        uploadedVideo.videoDuration > MAX_VIDEO_DURATION ||
        !["mp4", "webm"].includes(uploadedVideo.videoFormat)
      ) {
        await removeUnsavedProjectVideo(uploadedVideo.videoPublicId);
        throw new Error("The project demo must be an MP4 or WebM video up to 2 minutes and 20 MB.");
      }

      await onUploaded(uploadedVideo);
      showToast("Project demo uploaded.", true);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "The video could not be uploaded.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      {toast && (
        <div role="alert" className={`fixed right-4 top-4 z-[220] flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-md ${toast.success ? "border-emerald-300/25 bg-emerald-950/90 text-emerald-100" : "border-red-300/25 bg-red-950/90 text-red-100"}`}>
          {toast.success ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification"><X className="h-4 w-4" /></button>
        </div>
      )}

      {video && (
        <div className="mb-3 overflow-hidden rounded-xl border border-white/10 bg-black/30">
          <video src={video.videoUrl} controls preload="metadata" playsInline className="aspect-video w-full bg-black object-contain" />
          {onRemove && (
            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-3 py-2 text-xs text-zinc-400">
              <span>Current project demo</span>
              <button type="button" onClick={() => onRemove()} disabled={uploading || disabled} className="rounded-lg px-2 py-1 text-red-300 transition hover:bg-red-400/10 hover:text-red-200">Remove</button>
            </div>
          )}
        </div>
      )}

      <div
        onDragEnter={(event) => { event.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragOver={(event) => { event.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={(event) => { event.preventDefault(); if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsDragging(false); }}
        onDrop={(event) => { event.preventDefault(); setIsDragging(false); uploadFile(event.dataTransfer.files[0]); }}
        className={`relative grid min-h-40 place-items-center rounded-xl border border-dashed p-5 text-center transition duration-200 ${isDragging ? "border-sky-300 bg-sky-400/15 shadow-[0_0_30px_rgba(125,211,252,0.14)]" : "border-white/15 bg-black/20 hover:border-white/30 hover:bg-white/[0.04]"} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept="video/mp4,video/webm,.mp4,.webm" className="sr-only" onChange={(event) => uploadFile(event.target.files?.[0])} disabled={disabled || uploading} />
        <div>
          <span className={`mx-auto grid h-11 w-11 place-items-center rounded-xl border ${isDragging ? "border-sky-200/40 bg-sky-300/15 text-sky-100" : "border-white/10 bg-white/[0.06] text-zinc-300"}`}>
            {uploading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : isDragging ? <Film className="h-5 w-5" /> : <UploadCloud className="h-5 w-5" />}
          </span>
          <p className={`mt-3 text-sm font-medium ${isDragging ? "text-sky-100" : "text-zinc-200"}`}>{uploading ? "Uploading project demo…" : isDragging ? "Drop the video here" : video ? "Replace the demo video" : "Drag and drop the demo video"}</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">or click to browse · MP4 or WebM · up to 2 minutes and 20 MB</p>
        </div>
      </div>
    </div>
  );
}
