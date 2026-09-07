import { useState } from "react";
import { Thermometer } from "lucide-react";
import { EXPERIENCES } from "../data";
import LuminaFishCanvas from "./LuminaFishCanvas";

export default function ExperiencesCollective() {
  const [activeExpId, setActiveExpId] = useState<string>("exp-01");
  const activeExp = EXPERIENCES.find((e) => e.id === activeExpId) || EXPERIENCES[0];

  return (
    <section id="experiences-section" className="relative py-24 caustic-bg overflow-hidden">
      {/* Immersive deep ocean background video for Lumina Collective ambiance */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-25 mix-blend-screen"
        >
          <source src="https://res.cloudinary.com/dws1zhit2/video/upload/v1779692744/Deep_ocean_abyss_animation_202605251202_txtynu.mp4" type="video/mp4" />
        </video>
        {/* Subtle, premium edge-fade gradient overlay to blend seamlessly with adjacent sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-transparent to-brand-bg" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-brand-primary tracking-widest mb-3 block uppercase">EXPERIENCES</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-brand-on-surface tracking-tight">
            The Lumina Collective
          </h2>
          <p className="mt-4 text-brand-on-surface-variant max-w-2xl mx-auto font-sans text-base">
            Curated deep-sea rituals and culinary arts designed to echo high-altitude calmness in a weightless, timeless setting.
          </p>
        </div>

        {/* Highlight Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Left: Immersive Active Dining Graphic Card (Floating free without box) */}
          <div className="relative overflow-hidden flex flex-col justify-center items-center min-h-[480px] w-full">
            {/* Live 3D Shiny Fish Container */}
            <LuminaFishCanvas activeExpId={activeExpId} />
          </div>

          {/* Right: Selectable list of details & description */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              {EXPERIENCES.map((exp) => {
                const isActive = activeExpId === exp.id;
                return (
                  <button
                    key={exp.id}
                    onClick={() => setActiveExpId(exp.id)}
                    className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border flex flex-col justify-start text-sm ${
                      isActive
                        ? "bg-brand-surface-low border-brand-primary/30 shadow-lg"
                        : "bg-transparent border-transparent hover:bg-brand-surface-low/30 hover:border-brand-outline-variant/10 text-brand-on-surface-variant"
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <div className={`w-3 h-3 rounded-full ${isActive ? "bg-brand-primary glow-icon" : "bg-brand-outline-variant"}`} />
                      <span className="font-display font-black text-lg text-white">{exp.title}</span>
                    </div>
                    <p className="mt-2 text-brand-on-surface-variant text-xs pl-7 leading-relaxed">
                      {exp.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
