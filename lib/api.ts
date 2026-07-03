import type { AnalyzeResponse } from "./types";

export async function analyzeImage(file: File): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as AnalyzeResponse;

  if (!response.ok && data.success === false) {
    return data;
  }

  if (!response.ok) {
    return {
      success: false,
      error: "Tahlil qilishda xatolik yuz berdi. Qayta urinib ko'ring.",
    };
  }

  return data;
}
