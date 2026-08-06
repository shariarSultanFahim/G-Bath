"use client";

import { Switch } from "@/components/ui/switch";

export interface StepTiledDryAreaData {
  includeFlooring: boolean;
  flooringSelection: string;
  flooringNotes: string;
  includeToilet: boolean;
  toiletSelection: string;
  toiletNotes: string;
  includeVanity: boolean;
  vanityStyle: string;
  vanitySize: string;
  vanityNotes: string;
  includeMirrorLighting: boolean;
  mirrorChoice: string;
  lightingChoice: string;
  towelBarFinish: string;
  mirrorLightingNotes: string;
  includeUpgrades: boolean;
  upgrades: string[];
  upgradesNotes: string;
  notes: string;
}

interface Props {
  data: StepTiledDryAreaData;
  onUpdate: (data: Partial<StepTiledDryAreaData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const FLOORING_OPTIONS = [
  { id: "No Flooring", title: "No Flooring", subtext: "Skip flooring installation" },
  { id: "Premium Vinyl Tile (PVT)", title: "Premium Vinyl Tile (PVT)", subtext: "12\" x 24\" • Tile Look • 5 Colors" },
  { id: "Plank Style Flooring", title: "Plank Style Flooring", subtext: "6\" x 48\" • Wood Look • 8 Finishes" },
  { id: "Luxury Vinyl Plank (LVP)", title: "Luxury Vinyl Plank (LVP)", subtext: "7\" x 48\" • Premium • 12 Finishes" },
];

const TOILET_OPTIONS = [
  { id: "None", title: "None", subtext: "" },
  { id: "Standard Concealed Trapway", title: "Standard Concealed Trapway", subtext: "Skirted Base • Elongated Bowl • 1.6 GPF" },
  { id: "Smart Bidet Toilet", title: "Smart Bidet Toilet", subtext: "Heated Seat • Bidet • Auto-Flush • Dual Flush" },
];

const VANITY_STYLES = ["None", "Modern", "Traditional", "Custom"];
const VANITY_SIZES = ['24"', '30"', '36"', '42"', '48"', '54"', '60"', '72"', "Custom"];

const MIRROR_OPTIONS = [
  { id: "None", title: "None", subtext: "No mirror selected" },
  { id: "Standard Framed", title: "Standard Framed", subtext: "Classic design • Multiple frame colors" },
  { id: "Frameless", title: "Frameless", subtext: "Modern • Beveled edges • Clean look" },
  { id: "Smart Mirror", title: "Smart Mirror", subtext: "Anti-fog • Touch lighting • Bluetooth speaker" },
  { id: "LED Medicine Cabinet", title: "LED Medicine Cabinet", subtext: "Built-in LED lighting • Anti-fog • Storage" },
  { id: "Mirrored Medicine Cabinet", title: "Mirrored Medicine Cabinet", subtext: "Full mirrored door • Interior storage • Sleek design" },
  { id: "Custom Size", title: "Custom Size", subtext: "Any size • Custom shape available" },
];

const LIGHTING_OPTIONS = [
  { id: "None", title: "None", subtext: "" },
  { id: "LED Modern Light Bar", title: "LED Modern Light Bar", subtext: "" },
  { id: "LED Traditional Light Bar", title: "LED Traditional Light Bar", subtext: "" },
  { id: "Wall Sconce (Pair)", title: "Wall Sconce (Pair)", subtext: "" },
];

const TOWEL_BAR_FINISHES = ["None", "Chrome", "Black"];

const DRY_UPGRADES_OPTIONS = [
  { id: "Premium Vanity", title: "Premium Vanity", subtext: "Soft-Close • Marble Top • Dual Sinks" },
  { id: "Smart Mirror", title: "Smart Mirror", subtext: "Anti-Fog • Touch Lighting • Bluetooth" },
  { id: "Heated Towel Rack", title: "Heated Towel Rack", subtext: "Electric • Programmable Timer" },
  { id: "Premium Paint", title: "Premium Paint", subtext: "Washable • Moisture-Resistant • Mildew-Resistant" },
  { id: "Heated Floor System", title: "Heated Floor System", subtext: "Radiant Heating • Programmable Thermostat" },
  { id: "Steam System", title: "Steam System", subtext: "Steam Generator • Aromatherapy • LED Lighting" },
];

export function StepTiledDryArea({ data, onUpdate, onNext, onPrev }: Props) {
  const toggleUpgrade = (upgradeId: string) => {
    const current = data.upgrades || [];
    if (current.includes(upgradeId)) {
      onUpdate({ upgrades: current.filter((item) => item !== upgradeId) });
    } else {
      onUpdate({ upgrades: [...current, upgradeId] });
    }
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <h2 className="text-base font-bold text-slate-900 px-1">Tile Dry Area</h2>

      {/* Flooring Selection */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Flooring Selection</h3>
            <p className="text-[11px] text-slate-400">Beaulieu Fresque Series - 100% Waterproof</p>
          </div>
          <Switch checked={data.includeFlooring} onCheckedChange={(c) => onUpdate({ includeFlooring: c })} />
        </div>

        <div className={`space-y-3 transition-opacity ${!data.includeFlooring ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="space-y-2 pt-1">
            {FLOORING_OPTIONS.map((item) => {
              const isSelected = data.flooringSelection === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onUpdate({ flooringSelection: item.id })}
                  className={`cursor-pointer rounded-2xl border p-3.5 flex items-center justify-between transition-all ${
                    isSelected
                      ? item.id === "No Flooring"
                        ? "border-rose-300 bg-rose-50/50"
                        : "border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        isSelected && item.id === "No Flooring" ? "text-rose-500" : "text-slate-900"
                      }`}
                    >
                      {item.title}
                    </div>
                    {item.subtext && <div className="text-[11px] text-slate-400">{item.subtext}</div>}
                  </div>
                  {isSelected && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.id === "No Flooring" ? "bg-emerald-500 text-white" : "text-emerald-600 font-semibold"
                      }`}
                    >
                      {item.id === "No Flooring" ? "Selected" : "Selected"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Flooring Notes */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Flooring Notes:</label>
            <textarea
              rows={2}
              value={data.flooringNotes}
              onChange={(e) => onUpdate({ flooringNotes: e.target.value })}
              placeholder="Enter flooring details, measurements, or special instructions..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Toilet Selection */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-900">Toilet Selection</h3>
          <Switch checked={data.includeToilet} onCheckedChange={(c) => onUpdate({ includeToilet: c })} />
        </div>

        <div className={`space-y-3 transition-opacity ${!data.includeToilet ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="space-y-2">
            {TOILET_OPTIONS.map((item) => {
              const isSelected = data.toiletSelection === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onUpdate({ toiletSelection: item.id })}
                  className={`cursor-pointer rounded-2xl border p-3.5 flex items-center justify-between transition-all ${
                    isSelected
                      ? item.id === "None"
                        ? "border-rose-300 bg-rose-50/50"
                        : "border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        isSelected && item.id === "None" ? "text-rose-500" : "text-slate-900"
                      }`}
                    >
                      {item.title}
                    </div>
                    {item.subtext && <div className="text-[11px] text-slate-400">{item.subtext}</div>}
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-semibold text-emerald-600">Selected</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Toilet Notes:</label>
            <textarea
              rows={2}
              value={data.toiletNotes}
              onChange={(e) => onUpdate({ toiletNotes: e.target.value })}
              placeholder="Enter toilet details or special instructions..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Vanity Selection */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Vanity Selection</h3>
            <p className="text-[11px] text-slate-400">Painted Series - Wood Construction & Stone Top</p>
          </div>
          <Switch checked={data.includeVanity} onCheckedChange={(c) => onUpdate({ includeVanity: c })} />
        </div>

        <div className={`space-y-4 transition-opacity ${!data.includeVanity ? 'opacity-40 pointer-events-none' : ''}`}>
          {/* Style */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-slate-700">Style:</label>
            <div className="flex gap-2">
              {VANITY_STYLES.map((style) => {
                const isSelected =
                  data.vanityStyle === style || (style === "Custom" && !VANITY_STYLES.slice(0, 3).includes(data.vanityStyle));
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => {
                      if (style === "Custom") {
                        if (VANITY_STYLES.slice(0, 3).includes(data.vanityStyle)) {
                          onUpdate({ vanityStyle: "" });
                        }
                      } else {
                        onUpdate({ vanityStyle: style });
                      }
                    }}
                    className={`rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                      isSelected
                        ? (style === "None" ? "bg-rose-500 text-white shadow-sm" : "bg-[#C4A47C] text-white shadow-sm")
                        : style === "Custom"
                        ? "border border-dashed border-slate-300 bg-amber-50/20 text-slate-700"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>

            {/* Custom Style Input */}
            {(!VANITY_STYLES.slice(0, 3).includes(data.vanityStyle)) && (
              <div className="pt-1.5 space-y-1">
                <label className="block text-[11px] font-semibold text-slate-700">Enter Custom Style:</label>
                <input
                  type="text"
                  value={data.vanityStyle}
                  onChange={(e) => onUpdate({ vanityStyle: e.target.value })}
                  placeholder="e.g. Mid-Century Modern, Rustic, etc."
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Size */}
          {data.vanityStyle !== "None" && (
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-700">Size:</label>
              <div className="flex flex-wrap gap-2">
                {VANITY_SIZES.map((size) => {
                  const standardSizes = VANITY_SIZES.slice(0, 8);
                  const isSelected =
                    data.vanitySize === size || (size === "Custom" && !standardSizes.includes(data.vanitySize));
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        if (size === "Custom") {
                          if (standardSizes.includes(data.vanitySize)) {
                            onUpdate({ vanitySize: "" });
                          }
                        } else {
                          onUpdate({ vanitySize: size });
                        }
                      }}
                      className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-[#C4A47C] text-white shadow-sm"
                          : size === "Custom"
                          ? "border border-dashed border-slate-300 bg-amber-50/20 text-slate-700"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {/* Custom Size Input */}
              {(!VANITY_SIZES.slice(0, 8).includes(data.vanitySize)) && (
                <div className="pt-1.5 space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-700">Enter Custom Size (inches):</label>
                  <input
                    type="text"
                    value={data.vanitySize}
                    onChange={(e) => onUpdate({ vanitySize: e.target.value })}
                    placeholder="e.g. 27"
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Vanity Notes */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Vanity Notes:</label>
            <textarea
              rows={2}
              value={data.vanityNotes}
              onChange={(e) => onUpdate({ vanityNotes: e.target.value })}
              placeholder="Enter vanity details or special instructions..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Mirror / Medicine Cabinet Choice & Lighting / Towel Bar */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Mirror / Medicine Cabinet & Lighting Choice</h3>
            <p className="text-[11px] text-slate-400">Select your mirror, lighting, and towel bar</p>
          </div>
          <Switch checked={data.includeMirrorLighting} onCheckedChange={(c) => onUpdate({ includeMirrorLighting: c })} />
        </div>

        <div className={`space-y-6 transition-opacity ${!data.includeMirrorLighting ? 'opacity-40 pointer-events-none' : ''}`}>
          
          <div className="space-y-2 pt-1">
            <h4 className="text-[11px] font-semibold text-slate-700">Mirror / Cabinet:</h4>
            {MIRROR_OPTIONS.map((item) => {
              const isSelected = data.mirrorChoice === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onUpdate({ mirrorChoice: item.id })}
                  className={`cursor-pointer rounded-2xl border p-3.5 flex items-center justify-between transition-all ${
                    isSelected
                      ? item.id === "None"
                        ? "border-rose-300 bg-rose-50/50"
                        : "border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        isSelected && item.id === "None" ? "text-rose-500" : "text-slate-900"
                      }`}
                    >
                      {item.title}
                    </div>
                    {item.subtext && <div className="text-[11px] text-slate-400">{item.subtext}</div>}
                  </div>
                  {isSelected && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.id === "Custom Size" ? "bg-emerald-500 text-white" : "text-emerald-600 font-semibold"
                      }`}
                    >
                      Selected
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold text-slate-700">Lighting Choice:</h4>
            {LIGHTING_OPTIONS.map((item) => {
              const isSelected = data.lightingChoice === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onUpdate({ lightingChoice: item.id })}
                  className={`cursor-pointer rounded-2xl border p-3.5 flex items-center justify-between transition-all ${
                    isSelected
                      ? item.id === "None"
                        ? "border-rose-300 bg-rose-50/50"
                        : "border-[#D4AF37] bg-amber-50/40 ring-1 ring-[#D4AF37]/50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        isSelected && item.id === "None" ? "text-rose-500" : "text-slate-900"
                      }`}
                    >
                      {item.title}
                    </div>
                  </div>
                  {isSelected && <span className="text-[10px] font-semibold text-emerald-600">Selected</span>}
                </div>
              );
            })}
          </div>

          {/* Towel Bar Finish */}
          <div className="space-y-2">
            <h4 className="block text-[11px] font-semibold text-slate-700">Towel Bar Finish:</h4>
            <div className="flex gap-2">
              {TOWEL_BAR_FINISHES.map((finish) => {
                const isSelected = data.towelBarFinish === finish;
                return (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => onUpdate({ towelBarFinish: finish })}
                    className={`rounded-xl px-5 py-2 text-xs font-semibold transition-all ${
                      isSelected 
                        ? (finish === "None" ? "bg-rose-500 text-white shadow-sm" : "bg-[#C4A47C] text-white shadow-sm")
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {finish}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mirror / Lighting Notes */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mirror, Lighting & Towel Bar Notes:</label>
            <textarea
              rows={2}
              value={data.mirrorLightingNotes}
              onChange={(e) => onUpdate({ mirrorLightingNotes: e.target.value })}
              placeholder="Enter notes about mirrors, lighting or towel bars..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
            />
          </div>

        </div>
      </div>

      {/* Upgrades */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900">Upgrades</h3>
          <Switch checked={data.includeUpgrades} onCheckedChange={(c) => onUpdate({ includeUpgrades: c })} />
        </div>

        <div className={`space-y-4 transition-opacity ${!data.includeUpgrades ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className="space-y-3">
            {DRY_UPGRADES_OPTIONS.map((item) => {
              const isChecked = (data.upgrades || []).includes(item.id);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/40 p-3.5"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-400">{item.subtext}</div>
                  </div>
                  <Switch checked={isChecked} onCheckedChange={() => toggleUpgrade(item.id)} />
                </div>
              );
            })}
          </div>

          {/* Upgrades Notes */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Upgrades Notes:</label>
            <textarea
              rows={2}
              value={data.upgradesNotes}
              onChange={(e) => onUpdate({ upgradesNotes: e.target.value })}
              placeholder="Enter notes about upgrades..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 space-y-2">
        <h3 className="text-base font-bold text-slate-900">Notes</h3>
        <textarea
          rows={3}
          value={data.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Enter notes about this tile dry area..."
          className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8621A] focus:outline-none"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onPrev}
          className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          className="flex-1 rounded-2xl bg-[#E8621A] py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-600"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
