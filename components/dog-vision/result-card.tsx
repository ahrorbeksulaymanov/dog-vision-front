import type { AnalyzeResult } from "@/lib/types";
import { IconCheck, IconPaw, IconX } from "./icons";

type ResultCardProps = {
  result: AnalyzeResult;
};

export function ResultCard({ result }: ResultCardProps) {
  if (result.hasDog) {
    const confidencePercent = Math.round(result.confidence * 100);

    return (
      <div className="animate-fade-in rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm dark:border-emerald-800/50 dark:from-emerald-950/40 dark:to-teal-950/30 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
            <IconCheck className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Kuchuk aniqlandi!
            </p>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-2xl">
              {result.breed}
            </h3>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-stone-600 dark:text-stone-400">
                <span>Ishonchlilik</span>
                <span className="font-semibold">{confidencePercent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-emerald-200/60 dark:bg-emerald-900/40">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
            </div>
          </div>
          <IconPaw className="hidden h-10 w-10 shrink-0 text-emerald-300/80 sm:block dark:text-emerald-700/60" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in rounded-2xl border border-stone-200 bg-stone-50 p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900/60 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-300 text-stone-600 dark:bg-stone-700 dark:text-stone-300">
          <IconX className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
            Natija
          </p>
          <h3 className="mt-1 text-lg font-semibold text-stone-800 dark:text-stone-100 sm:text-xl">
            Bu rasmda kuchuk yo&apos;q
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            Boshqa rasm yuklang yoki kameradan kuchukni aniq ko&apos;rinadigan
            qilib qayta rasmga oling.
          </p>
        </div>
      </div>
    </div>
  );
}
