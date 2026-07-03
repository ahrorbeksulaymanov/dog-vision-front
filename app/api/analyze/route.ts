import { formatBreedName, isDogDetected } from "@/lib/breed";
import type { AnalyzeResponse } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_API_URL = "http://127.0.0.1:8000";

type PredictResponse = {
  breed?: string;
  confidence?: number;
  detail?: string | { msg: string }[];
};

function parseErrorMessage(data: PredictResponse, status: number): string {
  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data.detail) && data.detail[0]?.msg) {
    return data.detail[0].msg;
  }

  if (status === 422) {
    return "Noto'g'ri rasm formati. Boshqa rasm yuklang.";
  }

  return "Server tahlil qila olmadi. Keyinroq qayta urinib ko'ring.";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rasm topilmadi. Iltimos, rasm yuklang yoki kameradan oling.",
        } satisfies AnalyzeResponse,
        { status: 400 },
      );
    }

    const apiUrl = process.env.DOG_VISION_API_URL ?? DEFAULT_API_URL;

    const backendFormData = new FormData();
    const filename =
      image instanceof File && image.name ? image.name : "image.jpg";
    backendFormData.append("file", image, filename);

    const backendResponse = await fetch(`${apiUrl}/predict`, {
      method: "POST",
      body: backendFormData,
    });

    const data = (await backendResponse.json()) as PredictResponse;

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: parseErrorMessage(data, backendResponse.status),
        } satisfies AnalyzeResponse,
        { status: 502 },
      );
    }

    const breed = data.breed;
    const confidence = Number(data.confidence ?? 0);

    if (!breed || !isDogDetected(confidence)) {
      return NextResponse.json({
        success: true,
        data: { hasDog: false },
      } satisfies AnalyzeResponse);
    }

    return NextResponse.json({
      success: true,
      data: {
        hasDog: true,
        breed: formatBreedName(breed),
        confidence,
      },
    } satisfies AnalyzeResponse);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:
          "Serverga ulanib bo'lmadi. Backend ishlayotganini tekshiring (http://127.0.0.1:8000).",
      } satisfies AnalyzeResponse,
      { status: 500 },
    );
  }
}
