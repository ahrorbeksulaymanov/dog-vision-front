"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconCamera } from "./icons";

type CameraCaptureProps = {
  onCapture: (file: File) => void;
  disabled?: boolean;
};

export function CameraCapture({ onCapture, disabled }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Brauzeringiz kamerani qo'llab-quvvatlamaydi.");
      return;
    }

    try {
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsActive(true);
    } catch {
      setError(
        "Kameraga ruxsat berilmadi. Sozlamalardan ruxsat bering yoki rasm yuklang.",
      );
      stopCamera();
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `dog-vision-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCapture(file);
        stopCamera();
      },
      "image/jpeg",
      0.92,
    );
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    if (isActive) {
      void startCamera();
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-amber-300/60 bg-amber-50/50 p-6 text-center dark:border-amber-700/40 dark:bg-amber-950/20">
        <p className="text-sm text-amber-800 dark:text-amber-200">{error}</p>
        <label className="cursor-pointer rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-600">
          Galereyadan tanlash
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            disabled={disabled}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onCapture(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    );
  }

  if (!isActive) {
    return (
      <button
        type="button"
        onClick={() => void startCamera()}
        disabled={disabled}
        className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 px-6 py-12 transition hover:border-amber-400 hover:bg-amber-50/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-600 dark:bg-stone-900/50 dark:hover:border-amber-600 dark:hover:bg-amber-950/20"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
          <IconCamera className="h-7 w-7" />
        </span>
        <span className="text-base font-medium text-stone-700 dark:text-stone-200">
          Kamerani ochish
        </span>
        <span className="text-sm text-stone-500 dark:text-stone-400">
          Rasmga olish uchun bosing
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          className="aspect-[4/3] w-full object-cover sm:aspect-video"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={capturePhoto}
          disabled={disabled}
          className="flex-1 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
        >
          Rasmga olish
        </button>
        <button
          type="button"
          onClick={switchCamera}
          disabled={disabled}
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
        >
          Almashtirish
        </button>
        <button
          type="button"
          onClick={stopCamera}
          disabled={disabled}
          className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
        >
          Bekor qilish
        </button>
      </div>
    </div>
  );
}
