"use client";

import { useEffect, useState } from "react";
import { Camera, Upload, UserCheck } from "lucide-react";
import { toast } from "sonner";

export interface Step1Data {
  bathSize: string;
  showerSize: string;
  wallMaterial: string;
  flooringSquareFt: string;
  flooringMaterial: string;
  measurements: string;
  vanitySize: string;
  notes: string;
  photos: string[];
}

interface CustomerOption {
  id: string;
  name: string;
  phone: string;
  appointments?: { id: string; time: string; date: string }[];
}

interface Props {
  data: Step1Data;
  onUpdate: (data: Partial<Step1Data>) => void;
  onNext: () => void;
  onCancel: () => void;
  selectedCustomerId: string;
  onSelectCustomer: (customerId: string, appointmentId?: string, customerName?: string) => void;
  customerName?: string;
  appointmentTime?: string;
}

export function Step1Assess({
  data,
  onUpdate,
  onNext,
  onCancel,
  selectedCustomerId,
  onSelectCustomer,
  customerName,
  appointmentTime,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((list) => {
        if (Array.isArray(list)) setCustomers(list);
      })
      .catch(console.error);
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { urls } = await res.json();
        onUpdate({ photos: [...(data.photos || []), ...urls] });
        toast.success("Photos uploaded");
      } else {
        toast.error("Photo upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleNextClick = () => {
    if (!selectedCustomerId) {
      toast.error("Please select a customer before proceeding");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-5">
      {/* Customer Selection Banner / Picker */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Customer</h3>

        {selectedCustomerId && !isChanging ? (
          <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900">{customerName}</h4>
              {appointmentTime && <p className="text-xs text-slate-500">{appointmentTime}</p>}
            </div>
            <button
              type="button"
              onClick={() => setIsChanging(true)}
              className="text-xs font-bold text-[#E8621A] hover:underline"
            >
              Change
            </button>
          </div>
        ) : (
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
              Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                const id = e.target.value;
                const found = customers.find((c) => c.id === id);
                if (found) {
                  onSelectCustomer(found.id, found.appointments?.[0]?.id || "", found.name);
                  setIsChanging(false);
                }
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
            >
              <option value="">-- Choose Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Existing Bathroom Form */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Existing Bathroom</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Existing Bath Size
            </label>
            <input
              type="text"
              value={data.bathSize}
              onChange={(e) => onUpdate({ bathSize: e.target.value })}
              placeholder="e.g. 5ft standard"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Existing Shower Size
            </label>
            <input
              type="text"
              value={data.showerSize}
              onChange={(e) => onUpdate({ showerSize: e.target.value })}
              placeholder='e.g. 36" × 36"'
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
            Existing Wall Material
          </label>
          <div className="flex gap-4">
            {["Tile", "Acrylic"].map((mat) => (
              <label key={mat} className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="wallMaterial"
                  value={mat}
                  checked={data.wallMaterial === mat}
                  onChange={(e) => onUpdate({ wallMaterial: e.target.value })}
                  className="accent-[#E8621A] h-4 w-4"
                />
                {mat}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Existing Flooring SQ FT
            </label>
            <input
              type="text"
              value={data.flooringSquareFt}
              onChange={(e) => onUpdate({ flooringSquareFt: e.target.value })}
              placeholder="e.g. 48"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">
              Flooring Material
            </label>
            <div className="flex gap-3 pt-1">
              {["Tile", "Acrylic"].map((mat) => (
                <label key={mat} className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="flooringMaterial"
                    value={mat}
                    checked={data.flooringMaterial === mat}
                    onChange={(e) => onUpdate({ flooringMaterial: e.target.value })}
                    className="accent-[#E8621A]"
                  />
                  {mat}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Bathroom Measurements
            </label>
            <input
              type="text"
              value={data.measurements}
              onChange={(e) => onUpdate({ measurements: e.target.value })}
              placeholder="e.g. 3.2m × 2.4m"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Vanity Size
            </label>
            <input
              type="text"
              value={data.vanitySize}
              onChange={(e) => onUpdate({ vanitySize: e.target.value })}
              placeholder='e.g. 36"'
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Notes</label>
          <textarea
            rows={2}
            value={data.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Additional observations..."
            className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
          />
        </div>
      </div>

      {/* Capture Bathroom Photos */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capture Bathroom Photos</h3>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center cursor-pointer hover:border-[#E8621A]">
            <Camera className="h-6 w-6 text-slate-400" />
            <span className="mt-1 text-xs font-bold text-slate-700">Take Photo</span>
            <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
          </label>

          <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center cursor-pointer hover:border-[#E8621A]">
            <Upload className="h-6 w-6 text-slate-400" />
            <span className="mt-1 text-xs font-bold text-slate-700">Upload Photo</span>
            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>

        {uploading && <p className="text-xs text-slate-400 italic">Uploading photo...</p>}

        {data.photos && data.photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 pt-2">
            {data.photos.map((url, i) => (
              <img key={i} src={url} alt="Bathroom photo" className="h-20 w-full rounded-xl object-cover border border-slate-200" />
            ))}
          </div>
        )}
        <p className="text-[11px] text-center text-slate-400">{data.photos?.length || 0} photos attached</p>
      </div>

      {/* Action Footer */}
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600">
          Cancel
        </button>
        <button onClick={handleNextClick} className="flex-1 rounded-2xl bg-[#E8621A] py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-600">
          Next →
        </button>
      </div>
    </div>
  );
}
