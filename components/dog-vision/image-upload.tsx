"use client";

import { useRef } from "react";
import { IconUpload } from "./icons";

type ImageUploadProps = {
  onSelect: (file: File) => void;
  disabled?: boolean;
};

export function ImageUpload({ onSelect, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) {
      onSelect(file);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="relative"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={disabled}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-12 transition hover:border-amber-400 hover:bg-amber-50/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-600 dark:bg-stone-900/50 dark:hover:border-amber-600 dark:hover:bg-amber-950/20"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
          <IconUpload className="h-7 w-7" />
        </span>
        <span className="text-base font-medium text-stone-700 dark:text-stone-200">
          Rasm yuklash
        </span>
        <span className="text-sm text-stone-500 dark:text-stone-400">
          Bosing yoki bu yerga tashlang
        </span>
        <span className="text-xs text-stone-400 dark:text-stone-500">
          JPG, PNG, WEBP
        </span>
      </button>
    </div>
  );
}
