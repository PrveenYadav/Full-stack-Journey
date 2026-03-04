"use client";

import { UploadCloud, XIcon, Loader2 } from "lucide-react";
import { useState } from "react";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
}

export default function ImageUpload({ onChange, value }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      onChange(data.url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Image preview
  if (value) {
    return (
      <div className="relative size-40">
        <img
          src={value}
          className="rounded-md size-40 object-cover"
        />

        <button
          onClick={() => onChange("")}
          className="absolute top-0 right-0 p-1 bg-red-500 rounded-full"
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>
      </div>
    );
  }

  // Uploading state
  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10">
        <Loader2 className="size-6 animate-spin mb-2 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Uploading image...
        </span>
      </div>
    );
  }

  // Upload button
  return (
    <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 cursor-pointer hover:border-primary">
      <UploadCloud className="size-6 mb-2" />
      <span className="text-sm text-muted-foreground">
        Click to upload image
      </span>

      <input
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImage(file);
        }}
      />
    </label>
  );
}