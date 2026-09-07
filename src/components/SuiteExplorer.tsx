import { useRef, useState, useEffect } from "react";
import { Check, Compass, Eye, Wind, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SUITES } from "../data";
import { Suite } from "../types";

interface SuiteExplorerProps {
  selectedSuiteId: string;
  onSelectSuite: (suiteId: string) => void;
}

export default function SuiteExplorer({ selectedSuiteId, onSelectSuite }: SuiteExplorerProps) {
  const suitesContainerRef = useRef<HTMLDivElement>(null);
  const featuresContainerRef = useRef<HTMLDivElement>(null);

  const [activeSuiteIdx, setActiveSuiteIdx] = useState(0);
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);

  // Scroll listener to detect active suite index during sticky viewport pinning
  useEffect(() => {
    const handleScroll = () => {
      // 1. Suites Calculation
      if (suitesContainerRef.current) {
        const rect = suitesContainerRef.current.getBoundingClientRect();
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        const scrolled = -rect.top;
        const scrollable = elementHeight - viewportHeight;

        if (scrollable > 0) {
          const progress = Math.max(0, Math.min(1, scrolled / scrollable));
          // Split into 3 segments smoothly
          const index = Math.min(2, Math.floor(progress * 2.99));
          setActiveSuiteIdx(index);
        }
      }

      // 2. Features Calculation
      if (featuresContainerRef.current) {
        const rect = featuresContainerRef.current.getBoundingClientRect();
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        const scrolled = -rect.top;
        const scrollable = elementHeight - viewportHeight;

        if (scrollable > 0) {
          const progress = Math.max(0, Math.min(1, scrolled / scrollable));
          // Split into 3 segments smoothly
          const index = Math.min(2, Math.floor(progress * 2.99));
          setActiveFeatureIdx(index);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLockIn = (suite: Suite) => {
    onSelectSuite(suite.name);
    const targetElement = document.getElementById("inquiry-section");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const orderedSuites = [
    SUITES.find((s) => s.depth === 300) || SUITES[0],
    SUITES.find((s) => s.depth === 220) || SUITES[1],
    SUITES.find((s) => s.depth === 120) || SUITES[2],
  ].map((suite, idx) => {
    let premiumDetails = "";
    let premiumHighlights: string[] = [];
    if (idx === 0) {
      premiumDetails = "Carved directly into ancient basalt foundations with a fully reinforced crystalline dome, complete sensory silence, and direct pressure-lock systems.";
      premiumHighlights = ["Triple-reinforced crystalline dome", "Hyperbaric pressure calibration"];
    } else if (idx === 1) {
      premiumDetails = "Suspended above a living bioluminescent reef lagoon. Crafted with a bio-organic active ambient lighting system matching marine lunar cycles.";
      premiumHighlights = ["Coral reef observation pane", "Alpine-pure oxygen environment"];
    } else {
      premiumDetails = "Wrapped in multi-pane panoramic structural composites. Positioned along upper-depth channels to watch grand pelagic migrations.";
      premiumHighlights = ["360° celestial composite viewport", "Decibel-decoupled acoustic isolation"];
    }
    return {
      ...suite,
      additionalDetails: premiumDetails,
      highlights: premiumHighlights,
    };
  });

  const FEATURES = [
    {
      id: "feat-01",
      title: "Visual Clarity",
      tagline: "ZERO OPTICAL DISTORTION",
      description: "Triple-reinforced, ultra-clear crystalline sapphire glass ensures zero optical distortion of the surrounding deep-sea panorama.",
      icon: Eye,
      depthLabel: "30 atmospheres clearance",
      ambientColor: "rgba(0, 209, 255, 0.04)"
    },
    {
      id: "feat-02",
      title: "Atmospheric Purity",
      tagline: "MOUNTAIN FRESH AIR METRICS",
      description: "Proprietary dual-stage oxygen enrichment systems create a fresh alpine purity level ideal for restorative sleep cycles.",
      icon: Wind,
      depthLabel: "Calibrated 21% O2 envelope",
      ambientColor: "rgba(154, 234, 228, 0.04)"
    },
    {
      id: "feat-03",
      title: "Total Seclusion",
      tagline: "ACOUSTICALLY DECOUPLED CHAMBERS",
      description: "Acoustically floating chambers where atmospheric noise is decoupled completely, letting you rest in the rhythmic pulse of marine silence.",
      icon: Shield,
      depthLabel: "Decibel delta -90dB decay",
      ambientColor: "rgba(183, 196, 255, 0.04)"
    }
  ];

  return (
    <div id="sanctuary-section" className="relative-bg">
      
      {/* SECTION 1: ONE-BY-ONE SUITES STICKY VIEWER */}
      <div 
        ref={suitesContainerRef}
        className="relative h-[300vh] w-full"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-16 z-20">
          
          {/* Section Dynamic Top Header bar */}
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <span className="font-mono text-xs text-brand-primary tracking-widest block uppercase mb-1">
                THE SANCTUARY
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#edf2f7] tracking-tight">
                Ocean Floor Penthouses
              </h2>
            </div>
            {/* Elegant pagination pills */}
            <div className="flex items-center gap-3">
              {orderedSuites.map((suite, idx) => (
                <div key={suite.id} className="flex items-center gap-2">
                  <span className={`font-mono text-[10px] tracking-wider transition-colors duration-300 ${activeSuiteIdx === idx ? "text-brand-primary font-bold" : "text-white/30"}`}>
                    0{idx + 1}
                  </span>
                  <div className={`h-1 rounded-full transition-all duration-500 ${activeSuiteIdx === idx ? "w-10 bg-brand-primary" : "w-2 bg-white/20"}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Central Interactive Card Slide Frame */}
          <div className="relative flex-grow max-w-7xl mx-auto w-full flex items-center justify-center my-6">
            <AnimatePresence mode="wait">
              {orderedSuites.map((suite, index) => {
                if (activeSuiteIdx !== index) return null;
                const isSelected = selectedSuiteId === suite.name;

                return (
                  <motion.div
                    key={suite.id}
                    initial={{ opacity: 0, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, y: -15 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center w-full"
                  >
                    {/* Details Left Panel */}
                    <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center">

                      <div className="flex items-baseline gap-3 mb-4">
                        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                          {suite.name}
                        </h3>
                        <span className="font-mono text-xs text-brand-primary font-bold tracking-wide">
                          {suite.depth}M Depth
                        </span>
                      </div>

                      <p className="text-brand-on-surface-variant/90 font-sans text-sm sm:text-base leading-relaxed mb-6">
                        {suite.additionalDetails}
                      </p>

                      <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                        <button
                          onClick={() => handleLockIn(suite)}
                          className={`w-full sm:w-auto text-center px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-brand-primary text-brand-on-primary shadow-[0_0_20px_rgba(0,209,255,0.4)] scale-98"
                              : "bg-white text-brand-bg hover:bg-brand-primary hover:text-brand-on-primary hover:shadow-[0_0_15px_rgba(0,209,255,0.35)]"
                          }`}
                        >
                          {isSelected ? "Selected" : "Select & Inquire Room"}
                        </button>
                      </div>
                    </div>

                    {/* Image Right Panel with glowing metrics indicators */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                      <div className="relative group overflow-hidden rounded-2xl border border-brand-outline-variant/15 shadow-[0_15px_40px_rgba(0,0,0,0.6)] bg-slate-950">
                        <img
                          src={suite.image}
                          alt={suite.name}
                          className="w-full h-[250px] sm:h-[350px] lg:h-[400px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/95 via-transparent to-black/20 pointer-events-none" />

                        <div className="absolute top-5 right-5 flex items-center gap-2 bg-brand-bg/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono font-bold text-brand-primary tracking-wider shadow-lg">
                          <Compass className="w-3.5 h-3.5 animate-spin [animation-duration:12s]" /> 
                          <span>{suite.depth} METERS BELOW SURFACE</span>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Prompt indicators */}
          <div className="max-w-7xl mx-auto w-full text-center border-t border-white/5 pt-4">
            <span className="font-mono text-[9px] text-white/35 tracking-[0.2em] font-medium uppercase block animate-pulse">
              Scroll to continue descent
            </span>
          </div>

        </div>
      </div>

      {/* SECTION 2: AUTOMATIC INFINITE MARQUEE GLASS SENSORY CARD SLIDER */}
      <div className="relative py-24 w-full overflow-hidden bg-transparent border-t border-white/5">
        
        {/* Dynamic Section Header */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-16 mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="font-mono text-xs text-brand-secondary tracking-widest block uppercase mb-2">
              ABYSSAL CAPABILITIES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#edf2f7] tracking-tight">
              Sanctuary Physics
            </h2>
          </div>
          <p className="max-w-md text-brand-on-surface-variant/70 font-sans text-xs sm:text-sm leading-relaxed">
            Continuous sub-aquatic lifecycle monitoring and calibration systems ensuring absolute sanctuary integrity. Hover over any node to hold focus.
          </p>
        </div>

        {/* Marquee Visual Track Container with elegant gradient edge masks */}
        <div className="relative w-full flex items-center py-6 select-none overflow-hidden">
          {/* Translucent fade gradients on sides */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-brand-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-brand-bg to-transparent z-10 pointer-events-none" />

          {/* Scrolling tape wrapper */}
          <div className="animate-marquee flex gap-6 px-4">
            {/* Displaying duplicated array multiple times to form a seamless infinite horizon */}
            {[...FEATURES, ...FEATURES, ...FEATURES, ...FEATURES].map((feat, index) => {
              const IconComponent = feat.icon;
              return (
                <div
                  key={`${feat.id}-dup-${index}`}
                  className="relative flex-shrink-0 w-[300px] sm:w-[350px] p-6 sm:p-8 rounded-2xl bg-white/[0.025] hover:bg-white/[0.055] border border-white/10 hover:border-brand-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-[24px] transition-all duration-500 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Glowing colored ambient halo at the bottom right */}
                  <div
                    className="absolute w-40 h-40 rounded-full blur-[60px] pointer-events-none -bottom-12 -right-12 opacity-35 transition-opacity duration-500 group-hover:opacity-65"
                    style={{ backgroundColor: feat.ambientColor || "rgba(0, 209, 255, 0.03)" }}
                  />

                  {/* Header metadata layout */}
                  <div className="flex items-center justify-between w-full mb-6">
                    <span className="font-mono text-[9px] text-white/35 tracking-wider font-bold">
                      FLTR • 0{(index % 3) + 1}
                    </span>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-brand-primary/95 bg-brand-primary/10 px-2.5 py-0.5 rounded-full tracking-wide">
                      <span className="w-1 h-1 rounded-full bg-brand-primary animate-pulse" />
                      <span>{feat.depthLabel}</span>
                    </div>
                  </div>

                  {/* Content middle */}
                  <div className="mb-4">
                    {/* Icon indicator */}
                    <div className="w-10 h-10 rounded-full bg-brand-bg/80 border border-brand-primary/15 flex items-center justify-center mb-4 shadow-sm group-hover:border-brand-primary/35 transition-colors">
                      <IconComponent className="w-4.5 h-4.5 text-brand-primary" />
                    </div>

                    <span className="font-mono text-[8px] text-brand-primary tracking-[0.25em] font-extrabold uppercase block mb-1">
                      {feat.tagline}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-extrabold text-[#edf2f7] tracking-tight mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-brand-on-surface-variant/80 font-sans text-xs sm:text-[13px] leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  {/* Aesthetic telemetry footer */}
                  <div className="border-t border-white/5 pt-3 mt-2 flex items-center justify-between text-[8px] font-mono text-white/20">
                    <span>STATE: STABLE</span>
                    <span>PRESSURE CLEARANCE OK</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
