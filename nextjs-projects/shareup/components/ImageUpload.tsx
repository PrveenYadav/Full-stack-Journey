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

  if (value) {
    return (
      <div className="relative w-full max-w-sm rounded-xl overflow-hidden border bg-muted/20">

        <img
          src={value}
          className="w-full h-60 object-cover"
        />

        {/* Remove button */}
        <button
          onClick={() => onChange("")}
          className="
            absolute top-2 right-2
            bg-black/70 hover:bg-black
            p-2 rounded-full cursor-pointer
            transition
          "
        >
          <XIcon className="h-4 w-4 text-white" />
        </button>

      </div>
    );
  }

  if (isUploading) {
    return (
      <div className="
        flex flex-col items-center justify-center
        border-2 border-dashed
        rounded-xl
        p-12
        bg-muted/20
      ">
        <Loader2 className="size-7 animate-spin mb-3 text-muted-foreground" />

        <span className="text-sm text-muted-foreground">
          Uploading image...
        </span>
      </div>
    );
  }

  return (
    <label
      className="
        flex flex-col items-center justify-center
        border-2 border-dashed
        rounded-xl
        p-12
        cursor-pointer
        bg-muted/10
        hover:bg-muted/20
        hover:border-primary
        transition
        text-center
      "
    >

      <UploadCloud className="size-7 mb-3 text-muted-foreground" />

      <span className="text-sm font-medium">
        Upload Image
      </span>

      <span className="text-xs text-muted-foreground mt-1">
        Click to select an image
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