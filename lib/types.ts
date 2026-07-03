export type AnalyzeResult =
  | {
      hasDog: true;
      breed: string;
      confidence: number;
    }
  | {
      hasDog: false;
    };

export type AnalyzeResponse =
  | { success: true; data: AnalyzeResult }
  | { success: false; error: string };

export type ImageSource = "upload" | "camera";
