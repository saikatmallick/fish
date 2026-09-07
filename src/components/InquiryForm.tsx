import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Send, CheckCircle2, QrCode, Ship, ShieldCheck, Mail, User, Info, Calendar, ChevronDown } from "lucide-react";
import { InquiryFormData } from "../types";

interface InquiryFormProps {
  initialSuitePreference: string;
}

export default function InquiryForm({ initialSuitePreference }: InquiryFormProps) {
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: "",
    email: "",
    preferredZone: initialSuitePreference || "Abyssal Suite 01",
    specialRequests: "",
    receiveUpdates: true,
    lengthOfStay: "4 Nights"
  });

  const [formErrors, setFormErrors] = useState<{ fullName?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [boardingPassId, setBoardingPassId] = useState("");
  const [copied, setCopied] = useState(false);

  // Experience addons state
  const [addons, setAddons] = useState({
    culinary: true,
    spa: false,
    gallery: true
  });

  // Custom Dropdown Open States
  const [zoneOpen, setZoneOpen] = useState(false);
  const [stayOpen, setStayOpen] = useState(false);

  // Click outside to close custom select panels
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".custom-select-zone")) {
        setZoneOpen(false);
      }
      if (!target.closest(".custom-select-stay")) {
        setStayOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Automatically update preferredZone if the parent suite prop shifts
  useState(() => {
    if (initialSuitePreference) {
      setFormData((prev) => ({ ...prev, preferredZone: initialSuitePreference }));
    }
  });

  // Recalculates dynamically when preferredZone shifts
  if (initialSuitePreference && formData.preferredZone !== initialSuitePreference) {
    setFormData((prev) => ({ ...prev, preferredZone: initialSuitePreference }));
  }

  const validate = () => {
    const errors: { fullName?: string; email?: string } = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Please provide your full legal name.";
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = "Name must be at least 3 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Please specify an email address.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid luxury-class email.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate luxury-grade deep API verification delay
    setTimeout(() => {
      // Generate unique boarding reference
      const sectorCode = formData.preferredZone.includes("Abyssal") ? "ABY" : formData.preferredZone.includes("Coral") ? "CRL" : "TWL";
      const randomCode = Math.floor(100000 + Math.random() * 900000);
      setBoardingPassId(`AQL-${sectorCode}-${randomCode}`);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(boardingPassId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      preferredZone: "Abyssal Suite 01",
      specialRequests: "",
      receiveUpdates: true,
      lengthOfStay: "4 Nights"
    });
    setAddons({ culinary: true, spa: false, gallery: true });
    setIsSuccess(false);
  };

  // Pricing Estimators
  const getCalculatedEstimate = () => {
    let baseRate = 8500; // base rate per night
    if (formData.preferredZone.includes("Suite 01")) baseRate = 12500;
    else if (formData.preferredZone.includes("Suite 02")) baseRate = 9800;
    else if (formData.preferredZone.includes("Deck 03")) baseRate = 7200;

    const nights = parseInt(formData.lengthOfStay) || 4;
    let addonTotal = 0;
    if (addons.culinary) addonTotal += 1200;
    if (addons.spa) addonTotal += 850;
    if (addons.gallery) addonTotal += 450;

    const subTotal = (baseRate * nights) + addonTotal;
    return subTotal.toLocaleString();
  };

  return (
    <div id="inquiry-section" className="relative w-full py-24 overflow-hidden bg-brand-bg/50 border-t border-brand-outline-variant/10">
      
      {/* Clear Full-Screen Background Video */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          ref={(el) => { if (el) el.muted = true; }}
          className="w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/dws1zhit2/video/upload/v1779716398/0525_mj2ksz.mp4"
            type="video/mp4"
          />
        </video>
        {/* Subtle, premium edge-fade gradient overlay (very clear in center) */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-transparent to-brand-bg" />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
        
        {/* Container Box with Glassmorphism */}
        <div className="relative glass-card p-8 md:p-16 rounded-3xl overflow-hidden border border-brand-outline-variant/20 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {!isSuccess ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
            
            {/* Left side: The functional form */}
            <div className="lg:col-span-7">
              <div className="mb-10 text-left">
                <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-2">RESERVATIONS</span>
                <h2 className="font-display text-3xl font-extrabold text-white">Begin Your Voyage</h2>
                <p className="mt-3 text-brand-on-surface-variant text-sm leading-relaxed">
                  Tailor your 300-meter descent with our bespoke retreat planners. Input your parameters to preview your sub-aquatic itinerary and initiate clearance.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name & Email Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Full Name field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-brand-primary uppercase tracking-wider">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-outline-variant" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="ALEXANDER VANCE"
                        className={`w-full bg-brand-surface-low/80 border text-white font-sans text-sm rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-1 focus:ring-brand-primary/50 transition-all ${
                          formErrors.fullName ? "border-red-400" : "border-brand-outline-variant/35 focus:border-brand-primary"
                        }`}
                      />
                    </div>
                    {formErrors.fullName && (
                      <p className="text-red-400 text-xs font-mono">{formErrors.fullName}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-brand-primary uppercase tracking-wider">
                      Secured Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-outline-variant" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="VANCE@VOYAGE.COM"
                        className={`w-full bg-brand-surface-low/80 border text-white font-sans text-sm rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-1 focus:ring-brand-primary/50 transition-all ${
                          formErrors.email ? "border-red-400" : "border-brand-outline-variant/35 focus:border-brand-primary"
                        }`}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-red-400 text-xs font-mono">{formErrors.email}</p>
                    )}
                  </div>

                </div>

                {/* Preferred Zone & Length of Stay */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                  
                  {/* Preferred Zone dropdown */}
                  <div className="space-y-2 relative custom-select-zone">
                    <label className="block text-xs font-mono font-bold text-brand-primary uppercase tracking-wider">
                      Preferred Sanctuary Zone
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setZoneOpen(!zoneOpen);
                        setStayOpen(false);
                      }}
                      className="w-full bg-brand-surface-low/80 border border-brand-outline-variant/35 text-white font-sans text-sm rounded-xl px-4 py-3.5 outline-none flex justify-between items-center cursor-pointer transition-all duration-300 hover:border-brand-primary/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50"
                    >
                      <span className="font-sans text-sm text-white">
                        {formData.preferredZone === "Abyssal Suite 01" && "Abyssal Suite 01 (300M Depth)"}
                        {formData.preferredZone === "Coral Atrium Suite 02" && "Coral Atrium Suite 02 (220M Depth)"}
                        {formData.preferredZone === "Twilight Grand Deck 03" && "Twilight Grand Deck 03 (120M Depth)"}
                        {!["Abyssal Suite 01", "Coral Atrium Suite 02", "Twilight Grand Deck 03"].includes(formData.preferredZone) && formData.preferredZone}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-brand-outline-variant transition-transform duration-300 ${zoneOpen ? "rotate-180 text-brand-primary" : ""}`} />
                    </button>

                    {/* Custom Premium Dropdown Panel */}
                    {zoneOpen && (
                      <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-brand-bg/95 backdrop-blur-xl border border-brand-outline-variant/30 rounded-2xl p-2 z-50 shadow-2xl transition-all duration-200">
                        {[
                          { value: "Abyssal Suite 01", label: "Abyssal Suite 01 (300M Depth)" },
                          { value: "Coral Atrium Suite 02", label: "Coral Atrium Suite 02 (220M Depth)" },
                          { value: "Twilight Grand Deck 03", label: "Twilight Grand Deck 03 (120M Depth)" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, preferredZone: option.value }));
                              setZoneOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-sans text-sm cursor-pointer flex justify-between items-center ${
                              formData.preferredZone === option.value
                                ? "bg-brand-primary/10 text-brand-primary font-bold"
                                : "text-brand-on-surface-variant hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span>{option.label}</span>
                            {formData.preferredZone === option.value && (
                              <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Length of stay dropdown */}
                  <div className="space-y-2 relative custom-select-stay">
                    <label className="block text-xs font-mono font-bold text-brand-primary uppercase tracking-wider">
                      Voyage Duration
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setStayOpen(!stayOpen);
                        setZoneOpen(false);
                      }}
                      className="w-full bg-brand-surface-low/80 border border-brand-outline-variant/35 text-white font-sans text-sm rounded-xl px-4 py-3.5 outline-none flex justify-between items-center cursor-pointer transition-all duration-300 hover:border-brand-primary/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50"
                    >
                      <span className="font-sans text-sm text-white">
                        {formData.lengthOfStay === "3 Nights" && "3 Nights Immersion"}
                        {formData.lengthOfStay === "4 Nights" && "4 Nights Immersion"}
                        {formData.lengthOfStay === "7 Nights" && "7 Nights Decompress Path"}
                        {formData.lengthOfStay === "14 Nights" && "14 Nights Deep Sanctuary"}
                        {!["3 Nights", "4 Nights", "7 Nights", "14 Nights"].includes(formData.lengthOfStay) && formData.lengthOfStay}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-brand-outline-variant transition-transform duration-300 ${stayOpen ? "rotate-180 text-brand-primary" : ""}`} />
                    </button>

                    {/* Custom Premium Dropdown Panel */}
                    {stayOpen && (
                      <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-brand-bg/95 backdrop-blur-xl border border-brand-outline-variant/30 rounded-2xl p-2 z-50 shadow-2xl transition-all duration-200">
                        {[
                          { value: "3 Nights", label: "3 Nights Immersion" },
                          { value: "4 Nights", label: "4 Nights Immersion" },
                          { value: "7 Nights", label: "7 Nights Decompress Path" },
                          { value: "14 Nights", label: "14 Nights Deep Sanctuary" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, lengthOfStay: option.value }));
                              setStayOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-sans text-sm cursor-pointer flex justify-between items-center ${
                              formData.lengthOfStay === option.value
                                ? "bg-brand-primary/10 text-brand-primary font-bold"
                                : "text-brand-on-surface-variant hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span>{option.label}</span>
                            {formData.lengthOfStay === option.value && (
                              <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Experiences Checkbox add-ons */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono font-bold text-brand-primary uppercase tracking-wider">
                    Add-On Sub-Aquatic Itineraries
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    <button
                      type="button"
                      onClick={() => setAddons((prev) => ({ ...prev, culinary: !prev.culinary }))}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                        addons.culinary
                          ? "bg-brand-primary/10 border-brand-primary/30 text-white"
                          : "bg-brand-surface-low/40 border-brand-outline-variant/10 text-brand-on-surface-variant hover:bg-brand-surface-low/60"
                      }`}
                    >
                      <div className="text-xs">
                        <span className="font-bold block text-white font-sans">Lumina Lounge</span>
                        <span className="font-mono text-[10px] text-brand-primary/70">+$1,200 / RSVP</span>
                      </div>
                      <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${addons.culinary ? "border-brand-primary bg-brand-primary text-brand-on-primary" : "border-brand-outline-variant"}`}>
                        {addons.culinary && <CheckCircle2 className="w-3 h-3 fill-current" />}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAddons((prev) => ({ ...prev, spa: !prev.spa }))}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                        addons.spa
                          ? "bg-brand-primary/10 border-brand-primary/30 text-white"
                          : "bg-brand-surface-low/40 border-brand-outline-variant/10 text-brand-on-surface-variant hover:bg-brand-surface-low/60"
                      }`}
                    >
                      <div className="text-xs">
                        <span className="font-bold block text-white font-sans">Deep Calm Spa</span>
                        <span className="font-mono text-[10px] text-brand-primary/70">+$850 / Pass</span>
                      </div>
                      <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${addons.spa ? "border-brand-primary bg-brand-primary text-brand-on-primary" : "border-brand-outline-variant"}`}>
                        {addons.spa && <CheckCircle2 className="w-3 h-3 fill-current" />}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAddons((prev) => ({ ...prev, gallery: !prev.gallery }))}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                        addons.gallery
                          ? "bg-brand-primary/10 border-brand-primary/30 text-white"
                          : "bg-brand-surface-low/40 border-brand-outline-variant/10 text-brand-on-surface-variant hover:bg-brand-surface-low/60"
                      }`}
                    >
                      <div className="text-xs">
                        <span className="font-bold block text-white font-sans">Abyss Art Seats</span>
                        <span className="font-mono text-[10px] text-brand-primary/70">+$450 / VIP</span>
                      </div>
                      <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${addons.gallery ? "border-brand-primary bg-brand-primary text-brand-on-primary" : "border-brand-outline-variant"}`}>
                        {addons.gallery && <CheckCircle2 className="w-3 h-3 fill-current" />}
                      </div>
                    </button>

                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold text-brand-primary uppercase tracking-wider">
                    Special Requests or Dietary Requirements
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Specify physical altitude comfort zones, medical conditions, or dietary criteria..."
                    className="w-full bg-brand-surface-low/80 border border-brand-outline-variant/35 text-white font-sans text-sm rounded-xl p-4 outline-none focus:border-brand-primary/80 focus:ring-1 focus:ring-brand-primary/50 transition-all placeholder:text-brand-outline-variant/50"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="receiveUpdates"
                    name="receiveUpdates"
                    checked={formData.receiveUpdates}
                    onChange={handleCheckboxChange}
                    className="mt-1 h-4 p-2 bg-brand-surface-low border-brand-outline-variant text-brand-primary rounded focus:ring-brand-primary"
                  />
                  <label htmlFor="receiveUpdates" className="text-xs text-brand-on-surface-variant font-sans leading-relaxed select-none">
                    I authorize Aqualis Marine Coordination to verify ocean launch clearance protocols and transmit seasonal migration updates.
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-4 text-center sm:text-left">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-brand-primary text-brand-on-primary font-mono text-xs font-bold uppercase tracking-wider px-16 py-4.5 rounded-xl transition-all duration-300 shadow-lg shadow-brand-primary/10 hover:shadow-[0_0_24px_rgba(0,172,255,0.4)] disabled:opacity-50 active:scale-95 btn-glow flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-brand-on-primary border-t-transparent rounded-full animate-spin" />
                        Generating Clearance...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Send Voyage Inquiry
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* Right side: Dynamic live boarding estimate */}
            <div className="lg:col-span-5 h-full">
              <div className="p-8 rounded-2xl bg-brand-surface-low/80 border border-brand-primary/10 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden h-full">
                
                {/* Light accent element */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary" />

                <div className="space-y-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-primary font-mono font-bold uppercase tracking-wider">LIVE ITINERARY HUD</span>
                    <span className="text-brand-on-surface-variant/40 font-mono">STABILIZED</span>
                  </div>

                  <div className="border-b border-brand-outline-variant/20 pb-4 space-y-2">
                    <span className="text-[10px] text-brand-on-surface-variant block uppercase font-mono">SELECTED CABIN CATEGORY</span>
                    <span className="text-lg font-display font-bold text-white block">{formData.preferredZone}</span>
                    <span className="text-xs text-brand-secondary font-mono flex items-center gap-1.5">
                      <Ship className="w-3.5 h-3.5" /> Direct Launch Station: West Coast Marine Port
                    </span>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] text-brand-on-surface-variant block uppercase font-mono">PROVISIONAL COST METRICS</span>
                    
                    <div className="space-y-2 text-xs font-sans">
                      <div className="flex justify-between items-center">
                        <span className="text-brand-on-surface-variant">Lodge Fare ({formData.lengthOfStay}):</span>
                        <span className="text-white font-mono font-semibold">
                          ${formData.preferredZone.includes("Suite 01") ? "50,000" : formData.preferredZone.includes("Suite 02") ? "39,200" : "28,800"}
                        </span>
                      </div>

                      {addons.culinary && (
                        <div className="flex justify-between items-center">
                          <span className="text-brand-on-surface-variant">Lumina Lounge Chef Seats:</span>
                          <span className="text-brand-primary font-mono font-semibold">+$1,200</span>
                        </div>
                      )}

                      {addons.spa && (
                        <div className="flex justify-between items-center">
                          <span className="text-brand-on-surface-variant">Deep Calm Spa All-Pass:</span>
                          <span className="text-brand-primary font-mono font-semibold">+$850</span>
                        </div>
                      )}

                      {addons.gallery && (
                        <div className="flex justify-between items-center">
                          <span className="text-brand-on-surface-variant">Abyss Art Space Seats:</span>
                          <span className="text-brand-primary font-mono font-semibold">+$450</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center leading-loose">
                        <span className="text-brand-on-surface-variant">Custom Submersible Launch Fee:</span>
                        <span className="text-brand-tertiary font-mono font-semibold">INCLUDED</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final calculated price estimate block */}
                <div className="pt-6 border-t border-brand-outline-variant/20 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-brand-on-surface-variant block uppercase font-mono">ESTIMATED RATE</span>
                    <span className="font-mono text-xs text-brand-on-surface-variant/40">(Inc. tax, security, &amp; cargo checks)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-2xl font-black text-brand-primary">${getCalculatedEstimate()}</span>
                    <span className="text-brand-on-surface-variant text-[10px] font-mono block">USD TOTAL</span>
                  </div>
                </div>

                {/* Secure booking assurance notice */}
                <div className="p-4 rounded-xl bg-brand-bg border border-brand-outline-variant/10 text-[11px] text-brand-on-surface-variant/75 flex gap-2.5 items-start font-sans leading-normal">
                  <Info className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5 glow-icon" />
                  <p>
                    All rates are certified secure until clearance. Final cabin assignments guaranteed upon successful medical telemetry check.
                  </p>
                </div>

              </div>
            </div>

          </div>
        ) : (
          /* Submission success ticket display screen */
          <div className="text-center relative z-10 py-10 max-w-2xl mx-auto space-y-10 animate-fade-in">
            
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary mb-4 shadow-[0_0_24px_rgba(0,209,255,0.2)] glow-icon">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="font-display text-3xl font-extrabold text-white">Voyage Form Approved</h2>
              <p className="text-brand-on-surface-variant text-base">
                Your credentials have cleared Pacific Air-Sea Command. Below is your provisional Digital Boarding Pass to Aqualis.
              </p>
            </div>

            {/* Fully stylized Boarding Ticket with luxury borders */}
            <div className="relative rounded-2xl bg-brand-surface-low border border-brand-primary/30 shadow-[0_0_40px_rgba(164,230,255,0.06)] overflow-hidden text-left font-mono text-xs">
              
              {/* Ticket Top bar */}
              <div className="bg-brand-primary text-brand-on-primary py-4 px-6 flex justify-between items-center font-bold">
                <span className="tracking-widest">AQUALIS DEEP-SEA TRANSIT</span>
                <span className="text-[10px]">VERIFIED DIRECT LAUNCH PASS</span>
              </div>

              {/* Ticket main contents */}
              <div className="p-6 md:p-8 space-y-6">
                
                {/* Sector names */}
                <div className="grid grid-cols-3 gap-4 items-center border-b border-brand-outline-variant/20 pb-4">
                  <div>
                    <span className="text-[10px] text-brand-on-surface-variant/60 block uppercase">SECTOR PRE-LAUNCH</span>
                    <span className="text-base text-white font-bold">WEST COAST PORT</span>
                  </div>
                  <div className="flex flex-col items-center justify-center relative">
                    <span className="text-[10px] text-brand-primary/40 uppercase">DESCENT 300M</span>
                    <div className="w-full h-[1px] bg-brand-primary/40 my-1 relative">
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_6px_rgba(0,209,255,0.8)]" />
                    </div>
                    <span className="text-[9px] text-brand-primary">7 MINS FLIGHT</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-brand-on-surface-variant/60 block uppercase">SECTOR ANCHOR</span>
                    <span className="text-base text-white font-bold">AQUALIS RESORT</span>
                  </div>
                </div>

                {/* Middle details block */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm font-sans">
                  <div>
                    <span className="text-[10px] font-mono text-brand-on-surface-variant/60 block uppercase">PASSENGER</span>
                    <span className="text-white font-bold uppercase truncate block mt-1">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-brand-on-surface-variant/60 block uppercase">SECURE PASS</span>
                    <span className="text-white font-mono block mt-1 text-[11px] truncate">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-brand-on-surface-variant/60 block uppercase">SUITE SELECTION</span>
                    <span className="text-white font-bold block mt-1">{formData.preferredZone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-brand-on-surface-variant/60 block uppercase">LENGTH OF STAY</span>
                    <span className="text-white font-bold block mt-1">{formData.lengthOfStay}</span>
                  </div>
                </div>

                {/* Verification references */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-brand-outline-variant/10 items-center">
                  
                  {/* Copyable Pass Ref */}
                  <div className="md:col-span-2 space-y-2">
                    <span className="text-[10px] text-brand-on-surface-variant/60 block uppercase">BOARDING LOCK ID</span>
                    <div className="flex items-center gap-2">
                      <span className="text-base text-brand-primary font-bold font-mono bg-brand-bg px-3 py-1.5 rounded border border-brand-outline-variant/20 tracking-wider">
                        {boardingPassId}
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="px-3 py-2 bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary/20 text-brand-primary rounded font-bold uppercase text-[10px] transition-all"
                      >
                        {copied ? "COPIED!" : "COPY ID"}
                      </button>
                    </div>
                  </div>

                  {/* Visual QR Code placeholder styled securely */}
                  <div className="flex justify-start md:justify-end">
                    <div className="bg-white p-2.5 rounded-lg inline-flex items-center gap-2 shadow-lg border border-brand-primary/20">
                      <QrCode className="w-12 h-12 text-brand-bg" strokeWidth={1.5} />
                      <div className="text-[9px] font-sans font-semibold text-brand-bg flex flex-col justify-center">
                        <span className="font-mono">PASS COMPLIANT</span>
                        <span>LAUNCH OK</span>
                        <span>05-25-2026</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Back options */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="px-8 py-3.5 border border-white/15 text-brand-on-surface font-mono text-xs font-semibold rounded-xl hover:bg-white/5 transition-all"
              >
                Submit New Request
              </button>
              <button
                onClick={() => {
                  const targetEle = document.getElementById("descent-simulator-section");
                  if (targetEle) {
                    targetEle.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="bg-brand-primary text-brand-on-primary font-mono text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(164,230,255,0.4)] btn-glow"
              >
                Enter Decent Simulator
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  </div>
  );
}
