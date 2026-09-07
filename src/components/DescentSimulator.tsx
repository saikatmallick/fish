import { useState, useEffect, useRef } from "react";
import { ChevronRight, Play, Square, Compass, Waves, Thermometer, ShieldAlert, BadgeInfo } from "lucide-react";
import { DESCENT_STEPS } from "../data";

export default function DescentSimulator() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentDepth, setCurrentDepth] = useState(300); // Defaults to fully submerged, but can go from 0 to 300
  const [pressure, setPressure] = useState(30); // in atm
  const [temp, setTemp] = useState(4); // in Celsius
  const [simulationLog, setSimulationLog] = useState<string>("Submersible docked at the 300M Deep-Sea Sanctuary.");
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-simulation interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setCurrentDepth((prev) => {
          if (prev >= 300) {
            setIsSimulating(false);
            setSimulationLog("Arrival Complete. Airlock equalized. Welcome to Aqualis.");
            setActiveTab(3);
            return 300;
          }
          
          const nextDepth = prev + 5;
          
          // Calculate realistic ocean temperature and pressure
          // Pressure increases by roughly 1 atm per 10m
          const nextPressure = +(1 + (nextDepth / 10)).toFixed(1);
          // Temperature drops from 24C dry lands to 4C deep abyss
          const nextTemp = +(24 - (20 * (nextDepth / 300))).toFixed(1);
          
          setPressure(nextPressure);
          setTemp(nextTemp);

          // Update active step based on depth thresholds
          if (nextDepth < 100) {
            setActiveTab(1);
            setSimulationLog(`Descending through upper sunlight layers. Current depth: ${nextDepth}m.`);
          } else if (nextDepth >= 100 && nextDepth < 250) {
            setActiveTab(2);
            setSimulationLog(`Entering twilight zone. External illumination fading. Current depth: ${nextDepth}m.`);
          } else {
            setActiveTab(3);
            setSimulationLog(`Deep sub-aquatic approach. Reaching midnight zone at ${nextDepth}m.`);
          }

          return nextDepth;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating]);

  const startSimulation = () => {
    setCurrentDepth(0);
    setPressure(1.0);
    setTemp(24.0);
    setIsSimulating(true);
    setSimulationLog("Initiating private submersible launch sequence. Coordinates locked.");
    setActiveTab(1);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    setSimulationLog("Simulation paused by pilot command.");
  };

  const resetToArrival = () => {
    setIsSimulating(false);
    setCurrentDepth(300);
    setPressure(30.0);
    setTemp(4.0);
    setActiveTab(3);
    setSimulationLog("Submersible stationary at Aqualis Main Airlock. Depth: 300M.");
  };

  return (
    <div id="descent-simulator-section" ref={containerRef} className="py-24 caustic-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        
        {/* Header */}
        <div className="mb-16">
          <span className="font-mono text-xs text-brand-primary tracking-widest mb-3 block uppercase">THE JOURNEY</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-brand-on-surface tracking-tight">
                The Silent Descent
              </h2>
              <p className="mt-4 text-brand-on-surface-variant max-w-2xl font-sans text-base leading-relaxed">
                Your escape into the silence is not merely a transfer—it is a calibrated, sensory-shifting transition through the vertical layers of the Pacific.
              </p>
            </div>

            {/* Sim Controller Panel */}
            <div className="flex flex-wrap gap-3">
              {!isSimulating ? (
                <button
                  onClick={startSimulation}
                  className="flex items-center gap-2 bg-brand-primary text-brand-on-primary font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(164,230,255,0.4)] transition-all duration-300 btn-glow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Begin Simulated Descent
                </button>
              ) : (
                <button
                  onClick={stopSimulation}
                  className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-amber-500/20 transition-all duration-300"
                >
                  <Square className="w-3.5 h-3.5 fill-current" /> Pause Pilot Info
                </button>
              )}
              {currentDepth < 300 && (
                <button
                  onClick={resetToArrival}
                  className="px-5 py-3 rounded-xl border border-white/10 text-brand-on-surface font-mono text-xs hover:bg-white/5 transition-all"
                >
                  Reset To Destination
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Display Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Interactive Stepper & Details */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {DESCENT_STEPS.map((step) => {
                const isSelected = activeTab === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      if (!isSimulating) {
                        setActiveTab(step.id);
                        // Instantly adjust preview levels
                        if (step.id === 1) {
                          setCurrentDepth(50);
                          setPressure(5.0);
                          setTemp(18.0);
                          setSimulationLog("Inspecting sunlight zone layers. Tranquil solar rays filter down.");
                        } else if (step.id === 2) {
                          setCurrentDepth(180);
                          setPressure(18.0);
                          setTemp(10.0);
                          setSimulationLog("Inspecting twilight transition zone. Light frequencies filter into velvet sapphire.");
                        } else {
                          setCurrentDepth(300);
                          setPressure(30.0);
                          setTemp(4.0);
                          setSimulationLog("Inspecting midnight zone. Absolute silence. Bioluminescence is the only solar beacon.");
                        }
                      }
                    }}
                    disabled={isSimulating}
                    className={`w-full text-left flex gap-6 p-6 rounded-2xl transition-all duration-500 outline-none ${
                      isSelected
                        ? "bg-brand-surface-low border border-brand-primary/30 shadow-[0_4px_24px_rgba(0,209,255,0.06)]"
                        : "hover:bg-brand-surface-low/30 border border-transparent"
                    } ${isSimulating ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full border flex items-center justify-center font-mono font-bold text-sm transition-all duration-500 ${
                        isSelected
                          ? "bg-brand-primary/10 border-brand-primary text-brand-primary glow-icon"
                          : "border-brand-outline-variant/50 text-brand-on-surface-variant"
                      }`}
                    >
                      0{step.id}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`font-display text-lg font-bold transition-all ${
                            isSelected ? "text-white" : "text-brand-on-surface-variant hover:text-white"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <span className="font-mono text-xs opacity-50">{step.durationString}</span>
                      </div>
                      <p className="mt-2 text-brand-on-surface-variant leading-relaxed text-sm">
                        {step.description}
                      </p>

                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-brand-outline-variant/30 grid grid-cols-2 gap-4 font-mono text-xs">
                          <div>
                            <span className="text-brand-on-surface-variant block">Depth Target</span>
                            <span className="text-brand-primary font-bold">{step.fromDepth}m - {step.toDepth}m</span>
                          </div>
                          <div>
                            <span className="text-brand-on-surface-variant block">Pressure Target</span>
                            <span className="text-brand-secondary font-bold">{step.pressureRange}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Immersive Safety Guidelines Info */}
            <div className="p-5 rounded-2xl bg-brand-surface-low/50 border border-brand-outline-variant/20 flex gap-4 items-start">
              <BadgeInfo className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5 glow-icon" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-white block">Calibrated Descent Safety Protocols</span>
                <p className="text-brand-on-surface-variant leading-relaxed">
                  Pressure stabilization involves automatic inner ear gas regulation utilizing specialized argon-oxygen atmosphere mixes, fully avoiding standard scuba decompression sickness risks.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Panoramic Submersion Graphic & Real-Time Telemetry Gauges */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="relative h-[480px] rounded-2xl overflow-hidden glass-card flex flex-col justify-between p-8">
              
              {/* Overlay graphics representing physical water layers */}
              <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-cyan-950/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,209,255,0.06)_0%,transparent_60%)] pointer-events-none" />
              
              {/* Dynamic Ocean Depth Axis on the Left */}
              <div className="absolute left-6 top-10 bottom-10 w-1 flex flex-col justify-between items-center pointer-events-none">
                <div className="h-full w-[2px] bg-brand-outline-variant/20 relative">
                  {/* Active Indicator Slide */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-primary border-4 border-brand-bg transition-all duration-300 shadow-[0_0_12px_rgba(0,209,255,0.8)]"
                    style={{ top: `${(currentDepth / 300) * 100}%` }}
                  />
                </div>
              </div>

              {/* Graphic Depth Text Markers */}
              <div className="absolute left-10 top-10 bottom-10 flex flex-col justify-between text-[10px] font-mono text-brand-on-surface-variant/40 pointer-events-none select-none">
                <span>0M (Sea Level)</span>
                <span>100M (Sunlight Limit)</span>
                <span>200M (Twilight Edge)</span>
                <span>300M (Aqualis Sanctuary)</span>
              </div>

              {/* Submersible Image overlay inside the glass container with real active transforms */}
              <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
                <div 
                  className="relative w-full max-w-[320px] transition-all duration-500 ease-out" 
                  style={{ 
                    transform: `translateY(${-40 + (currentDepth / 300) * 80}px) scale(${0.9 + (currentDepth / 300) * 0.1})`,
                    filter: `hue-rotate(${(currentDepth / 300) * 20}deg)`
                  }}
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAglB3qmS3TyoFAb-BsfXNIfiuh65EVOppHuryRAjTqPVEOZAzRGvCdwsLG1yfgxfmQqMdlRxqAcmWwZczIXyIHu5r8nMC-k4Y5rI0PvIIuQV4QDA7e17fWISy8wkz_bZavvLBlpCPwFRYubBadVf5u3go7YDCUzhevFlSA_eTrjtNpWZ0BxcEq1CR-5fCdJymg79RzUjHpJaXgSYt-vtvYbGfZN6OpUNT6Eoh3T9ztjuHa9WEbHQGCYUibR46hjrF8T-tVK94RYOM"
                    alt="Luxury Submersible"
                    className="w-full object-contain rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] brightness-95 contrast-105"
                  />
                  
                  {/* Active Beacon light */}
                  <div className="absolute top-[42%] right-[10%] w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                  <div className="absolute top-[42%] right-[10%] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#4cd6ff]" />
                </div>
              </div>

              {/* Active Submersible Telemetry HUD */}
              <div className="relative z-10 w-full flex justify-between items-start">
                <div className="flex items-center gap-2 bg-brand-bg/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-brand-outline-variant/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                  <span className="font-mono text-xs text-brand-primary">PILOT TELEMETRY</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] text-brand-on-surface-variant block uppercase">HULL CLASSIFICATION</span>
                  <span className="font-mono text-xs text-white font-semibold">DEEP-VANE COOPER V</span>
                </div>
              </div>

              {/* Real-time Telemetry Readout Box (Bottom of Graphic Panel) */}
              <div className="relative z-10 grid grid-cols-3 gap-4 bg-brand-bg/90 backdrop-blur-xl p-5 rounded-xl border border-brand-outline-variant/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-brand-on-surface-variant">
                    <Compass className="w-3.5 h-3.5 text-brand-primary" />
                    <span className="font-mono text-[9px] uppercase tracking-wider">Depth</span>
                  </div>
                  <div className="font-mono text-lg font-bold text-white flex items-baseline">
                    <span>{currentDepth}</span>
                    <span className="text-xs text-brand-primary ml-0.5">M</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-brand-on-surface-variant">
                    <Waves className="w-3.5 h-3.5 text-brand-secondary" />
                    <span className="font-mono text-[9px] uppercase tracking-wider">Pressure</span>
                  </div>
                  <div className="font-mono text-lg font-bold text-white flex items-baseline">
                    <span>{pressure}</span>
                    <span className="text-xs text-brand-secondary ml-0.5">ATM</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-brand-on-surface-variant">
                    <Thermometer className="w-3.5 h-3.5 text-brand-tertiary" />
                    <span className="font-mono text-[9px] uppercase tracking-wider">Temp</span>
                  </div>
                  <div className="font-mono text-lg font-bold text-white flex items-baseline">
                    <span>{temp}</span>
                    <span className="text-xs text-brand-tertiary ml-0.5">°C</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
