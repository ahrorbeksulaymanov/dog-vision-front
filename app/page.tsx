import { DogVisionApp } from "@/components/dog-vision/dog-vision-app";

export default function Home() {
  return (
    <div className="min-h-full flex-1 bg-gradient-to-b from-amber-50/80 via-stone-50 to-orange-50/50 dark:from-stone-950 dark:via-stone-950 dark:to-amber-950/20">
      <DogVisionApp />
    </div>
  );
}
