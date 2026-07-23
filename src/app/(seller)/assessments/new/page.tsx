"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StepIndicator } from "@/components/assessment/step-indicator";
import { Step1Assess, Step1Data } from "@/components/assessment/step-1-assess";
import { Step2WetArea, Step2Data } from "@/components/assessment/step-2-wet-area";
import { Step3DryArea, Step3Data } from "@/components/assessment/step-3-dry-area";
import { Step4Upgrades, Step4Data } from "@/components/assessment/step-4-upgrades";
import { Step5Review } from "@/components/assessment/step-5-review";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function NewAssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialApptId = searchParams.get("appointmentId") || "";
  const initialCustId = searchParams.get("customerId") || "";

  const [appointmentId, setAppointmentId] = useState(initialApptId);
  const [customerId, setCustomerId] = useState(initialCustId);

  const [currentStep, setCurrentStep] = useState(1);
  const [assessmentId, setAssessmentId] = useState<string | undefined>(undefined);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  const [customerName, setCustomerName] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [step1, setStep1] = useState<Step1Data>({
    bathSize: "",
    showerSize: "",
    wallMaterial: "Tile",
    flooringSquareFt: "",
    flooringMaterial: "Tile",
    measurements: "",
    vanitySize: "",
    notes: "",
    photos: [],
  });

  const [step2, setStep2] = useState<Step2Data>({
    includeBath: false,
    bathDetails: "",
    includeShower: false,
    showerDetails: "",
    acrylicTilePanel: "Acrylic Carrera Marble",
    notes: "",
  });

  const [step3, setStep3] = useState<Step3Data>({
    package: "Acrylic Flooring",
    vanityStyle: "Modern",
    vanityDetails: "",
    packageUpgrades: [],
    mirror: "LED",
    vanityLighting: "LED",
    upgradeLighting: "POT Lights",
    towelBars: "Chrome",
    comments: "",
  });

  const [step4, setStep4] = useState<Step4Data>({
    glassDoor: "Hinged Pivot Door",
  });

  useEffect(() => {
    if (appointmentId) {
      fetch(`/api/appointments/${appointmentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.customer) {
            setCustomerName(data.customer.name);
            setCustomerId(data.customerId);
            setAppointmentTime(`${data.time} - ${data.date?.slice(0, 10)}`);
          }
        });
    } else if (customerId) {
      fetch(`/api/customers/${customerId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.name) {
            setCustomerName(data.name);
          }
        });
    }
  }, [appointmentId, customerId]);

  const handleSelectCustomer = (cId: string, aId?: string, name?: string) => {
    setCustomerId(cId);
    if (aId) setAppointmentId(aId);
    if (name) setCustomerName(name);
  };

  // Only advance step counter during step 1-4 without calling API
  const handleNextStep = () => {
    if (!customerId) {
      toast.error("Please select a customer first");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  // Generate PDF or Save Assessment with all 5 steps payload
  const createFullAssessment = async () => {
    if (!customerId) {
      toast.error("Customer missing");
      return null;
    }

    const payload = {
      appointmentId: appointmentId || null,
      customerId,
      existingBathroom: step1,
      wetArea: step2,
      dryArea: step3,
      upgrades: step4,
      photos: step1.photos,
    };

    if (!assessmentId) {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        setAssessmentId(created.id);
        return created.id;
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create assessment");
        return null;
      }
    } else {
      await fetch(`/api/assessments/${assessmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return assessmentId;
    }
  };

  const handleGeneratePdf = async () => {
    const id = await createFullAssessment();
    if (!id) return;

    try {
      const res = await fetch(`/api/assessments/${id}/pdf`, { method: "POST" });
      if (res.ok) {
        const { pdfUrl } = await res.json();
        setPdfUrl(pdfUrl);
        toast.success("PDF Generated successfully!");
      } else {
        toast.error("PDF generation failed");
      }
    } catch {
      toast.error("An error occurred generating PDF");
    }
  };

  const handleFinalSubmit = async () => {
    const id = await createFullAssessment();
    if (!id) return;

    try {
      // Generate PDF first if not already generated
      if (!pdfUrl) {
        const pdfRes = await fetch(`/api/assessments/${id}/pdf`, { method: "POST" });
        if (pdfRes.ok) {
          const pdfData = await pdfRes.json();
          setPdfUrl(pdfData.pdfUrl);
        }
      }

      // Submit assessment
      const res = await fetch(`/api/assessments/${id}/submit`, { method: "POST" });
      if (res.ok) {
        toast.success("Assessment submitted successfully!");
        router.push("/assessments");
      } else {
        toast.error("Submission failed");
      }
    } catch {
      toast.error("An error occurred submitting assessment");
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Assess · Step 1 of 5";
      case 2:
        return "Wet Area · Step 2 of 5";
      case 3:
        return "Dry Area · Step 3 of 5";
      case 4:
        return "Upgrades · Step 4 of 5";
      case 5:
        return "Review · Step 5 of 5";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
        <div>
          <h2 className="font-bold text-slate-900 text-base">New Assessment</h2>
          <p className="text-xs text-slate-400 font-medium">{getStepTitle()}</p>
        </div>
        <button onClick={() => router.back()} className="rounded-full p-1 text-slate-400 hover:text-slate-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <StepIndicator currentStep={currentStep} />

      {currentStep === 1 && (
        <Step1Assess
          data={step1}
          onUpdate={(u) => setStep1((prev) => ({ ...prev, ...u }))}
          onNext={handleNextStep}
          onCancel={() => router.back()}
          selectedCustomerId={customerId}
          onSelectCustomer={handleSelectCustomer}
          customerName={customerName}
          appointmentTime={appointmentTime}
        />
      )}

      {currentStep === 2 && (
        <Step2WetArea
          data={step2}
          onUpdate={(u) => setStep2((prev) => ({ ...prev, ...u }))}
          onNext={handleNextStep}
          onPrev={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <Step3DryArea
          data={step3}
          onUpdate={(u) => setStep3((prev) => ({ ...prev, ...u }))}
          onNext={handleNextStep}
          onPrev={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <Step4Upgrades
          data={step4}
          onUpdate={(u) => setStep4((prev) => ({ ...prev, ...u }))}
          onNext={handleNextStep}
          onPrev={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 5 && (
        <Step5Review
          step1={step1}
          step2={step2}
          step3={step3}
          step4={step4}
          onGoToStep={(s) => setCurrentStep(s)}
          onPrev={() => setCurrentStep(4)}
          onSubmit={handleFinalSubmit}
          onGeneratePdf={handleGeneratePdf}
          pdfUrl={pdfUrl}
        />
      )}
    </div>
  );
}
