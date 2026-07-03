"use client";

import { analyzeImage } from "@/lib/api";
import type { AnalyzeResult, ImageSource } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { CameraCapture } from "./camera-capture";
import { IconCamera, IconPaw, IconSpinner, IconUpload } from "./icons";
import { ImageUpload } from "./image-upload";
import { ResultCard } from "./result-card";

type AppState = "idle" | "preview" | "analyzing" | "result" | "error";

export function DogVisionApp() {
  const [source, setSource] = useState<ImageSource>("upload");
  const [state, setState] = useState<AppState>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setState("idle");
  }, [previewUrl]);

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Faqat rasm fayllari qabul qilinadi.");
        setState("error");
        return;
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
      setResult(null);
      setError(null);
      setState("preview");
    },
    [previewUrl],
  );

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setState("analyzing");
    setError(null);

    const response = await analyzeImage(selectedFile);

    if (!response.success) {
      setError(response.error);
      setState("error");
      return;
    }

    setResult(response.data);
    setState("result");
  };

  const isBusy = state === "analyzing";

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8 sm:max-w-xl sm:px-6 sm:py-12 lg:max-w-2xl">
      <header className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/25">
          <IconPaw className="h-9 w-9" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-3xl">
          Dog Vision
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400 sm:text-base">
          Rasm yuklang yoki kameradan oling — kuchuk turini aniqlaymiz
        </p>
      </header>

      {state === "idle" && (
        <>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-stone-100 p-1 dark:bg-stone-800/80">
            <button
              type="button"
              onClick={() => setSource("upload")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                source === "upload"
                  ? "bg-white text-amber-700 shadow-sm dark:bg-stone-700 dark:text-amber-400"
                  : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
              }`}
            >
              <IconUpload className="h-4 w-4" />
              Yuklash
            </button>
            <button
              type="button"
              onClick={() => setSource("camera")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                source === "camera"
                  ? "bg-white text-amber-700 shadow-sm dark:bg-stone-700 dark:text-amber-400"
                  : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
              }`}
            >
              <IconCamera className="h-4 w-4" />
              Kamera
            </button>
          </div>

          {source === "upload" ? (
            <ImageUpload onSelect={handleFileSelect} />
          ) : (
            <CameraCapture onCapture={handleFileSelect} />
          )}
        </>
      )}

      {(state === "preview" || state === "analyzing" || state === "result") &&
        previewUrl && (
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-stone-100 shadow-md dark:bg-stone-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Tanlangan rasm"
                className="aspect-[4/3] w-full object-cover sm:aspect-video"
              />
              {state === "analyzing" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-stone-900/60 backdrop-blur-[2px]">
                  <IconSpinner className="h-10 w-10 animate-spin text-amber-400" />
                  <p className="text-sm font-medium text-white">
                    Tahlil qilinmoqda...
                  </p>
                </div>
              )}
            </div>

            {state === "result" && result && <ResultCard result={result} />}

            <div className="flex flex-col gap-2 sm:flex-row">
              {state === "preview" && (
                <button
                  type="button"
                  onClick={() => void handleAnalyze()}
                  className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition hover:from-amber-600 hover:to-orange-600"
                >
                  Kuchuk turini aniqlash
                </button>
              )}
              <button
                type="button"
                onClick={reset}
                disabled={isBusy}
                className="rounded-xl border border-stone-300 bg-white px-5 py-3.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
              >
                {state === "result" ? "Yangi rasm" : "Bekor qilish"}
              </button>
            </div>
          </div>
        )}

      {state === "error" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              Xatolik
            </p>
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
              {error}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Qayta urinish
          </button>
        </div>
      )}

      <p className="text-center text-xs text-stone-400 dark:text-stone-500">
        Rasm faqat tahlil uchun ishlatiladi va saqlanmaydi
      </p>
    </div>
  );
}
