const PRODUCTION_API_URL = "https://dog-vision-back.onrender.com";
const DEVELOPMENT_API_URL = "http://127.0.0.1:8000";

export function getApiUrl(): string {
  if (process.env.DOG_VISION_API_URL) {
    return process.env.DOG_VISION_API_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL) {
    return PRODUCTION_API_URL;
  }

  return DEVELOPMENT_API_URL;
}
