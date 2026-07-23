import { Check } from "lucide-react";

interface Props {
  currentStep: number;
  totalSteps?: number;
}

export function StepIndicator({ currentStep, totalSteps = 5 }: Props) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-4 py-2">
      {steps.map((step, idx) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                isCompleted
                  ? "bg-emerald-500 text-white"
                  : isCurrent
                  ? "bg-[#E8621A] text-white ring-4 ring-orange-100"
                  : "bg-orange-100 text-orange-400"
              }`}
            >
              {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : step}
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-all ${
                  isCompleted ? "bg-emerald-500" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
