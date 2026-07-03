const NO_DOG_CONFIDENCE_THRESHOLD = Number(
  process.env.DOG_VISION_MIN_CONFIDENCE ?? "0.4",
);

export function formatBreedName(breed: string): string {
  return breed
    .split("_")
    .map((word) =>
      word
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("-"),
    )
    .join(" ");
}

export function isDogDetected(confidence: number): boolean {
  return confidence >= NO_DOG_CONFIDENCE_THRESHOLD;
}
