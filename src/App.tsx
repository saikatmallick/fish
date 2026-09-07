import React, { useState, useEffect } from "react";
import { Compass, Waves, ChevronDown, Anchor, Calendar, HelpCircle, HelpCircle as HelpIcon, BellRing, Navigation } from "lucide-react";
import SuiteExplorer from "./components/SuiteExplorer";
import ExperiencesCollective from "./components/ExperiencesCollective";
import DescentSimulator from "./components/DescentSimulator";
import InquiryForm from "./components/InquiryForm";
import FishCanvas from "./components/FishCanvas";
import PremiumLoadingScreen from "./components/PremiumLoadingScreen";
import BubbleParticles from "./components/BubbleParticles";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  const [selectedSuite, setSelectedSuite] = useState<string>("Abyssal Suite 01");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroHover, setHeroHover] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Performance optimization: only compute when in viewport of Hero section
      if (window.scrollY > window.innerHeight) return;
      
      const x = (e.clientX / window.innerWidth) - 0.5; // -0.5 to 0.5
      const y = (e.clientY / window.innerHeight) - 0.5; // -0.5 to 0.5
      setHeroHover({ x, y });
    };

    const handleMouseLeave = () => {
      setHeroHover({ x: 0, y: 0 });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const FAQS = [
    {
      q: "How safe is a residency 300 meters deep?",
      a: "Aqualis is built using triple-redundant titanium structural support columns and pressurized sapphire outer panes engineered to withstand 40 atmospheres—well beyond the 30 atmospheres of active depth. Direct-vent nitrogen scrubbing and emergency lifepods protect all chambers autonomously."
    },
    {
      q: "Does room pressure resemble upper atmosphere levels?",
      a: "Yes. All chambers utilize state-of-the-art hyperbaric airlocks to calibrate your comfort envelope. Cabin pressure is constantly regulated to sea-level equivalent so that you can move freely without feeling any physical compression."
    },
    {
      q: "Can children and elder family members participate?",
      a: "Absolutely. Our medical launch clearance verifies that candidates have sufficient general circulation metrics. Transits are entirely automated, smooth, and calibrated for families of all ages."
    }
  ];

  return (
    <div className={`min-h-screen bg-brand-bg font-sans selection:bg-brand-primary selection:text-brand-on-primary ${loading ? "h-screen overflow-hidden" : ""}`}>
      
      {/* Premium Cinematic Entrance Loading Screen */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="premium-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03, filter: "blur(20px)" }}
            transition={{ duration: 0.9, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[9999]"
          >
            <PremiumLoadingScreen onComplete={() => setLoading(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sub-aquatic Bubble Particles */}
      <BubbleParticles />

      {/* Cinematic Fixed 3D Fish Canvas */}
      <div 
        style={{
          pointerEvents: scrollY < 120 ? "auto" : "none"
        }}
        className="fixed inset-0 z-10 w-full h-full"
      >
        <FishCanvas />
      </div>

      {/* Top Transparent Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <nav className="flex justify-between items-center w-full px-4 sm:px-6 lg:px-16 py-5 max-w-7xl mx-auto">
          {/* Logo */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
            className="font-display text-2xl font-black text-white tracking-tighter hover:text-brand-primary transition-all duration-300 outline-none cursor-pointer"
          >
            Aqualis
          </button>

          {/* Nav Items */}
          <div className="hidden md:flex gap-10 items-center">
            <button
              onClick={() => scrollToSection("sanctuary-section")}
              className="font-mono text-xs text-white border-b-2 border-white pb-1 outline-none nav-link-glow cursor-pointer font-bold tracking-wider"
            >
              The Sanctuary
            </button>
            <button
              onClick={() => scrollToSection("experiences-section")}
              className="font-mono text-xs text-white/85 hover:text-white transition-colors duration-300 outline-none nav-link-glow cursor-pointer font-bold tracking-wider"
            >
              Experiences
            </button>
            <button
              onClick={() => scrollToSection("descent-simulator-section")}
              className="font-mono text-xs text-white/85 hover:text-white transition-colors duration-300 outline-none nav-link-glow cursor-pointer font-bold tracking-wider"
            >
              The Voyage
            </button>
            <button
              onClick={() => scrollToSection("inquiry-section")}
              className="font-mono text-xs text-white/85 hover:text-white transition-colors duration-300 outline-none nav-link-glow cursor-pointer font-bold tracking-wider"
            >
              Inquire
            </button>
            <button
              onClick={() => scrollToSection("faq-section")}
              className="font-mono text-xs text-white/85 hover:text-white transition-colors duration-300 outline-none nav-link-glow cursor-pointer font-bold tracking-wider"
            >
              Support
            </button>
          </div>

          {/* Action Call Button */}
          <button
            onClick={() => scrollToSection("inquiry-section")}
            className="bg-white text-brand-bg hover:bg-brand-primary hover:text-brand-on-primary px-6 py-2.5 rounded-full font-mono text-xs font-bold transition-all duration-300 active:scale-95 shadow-xl cursor-pointer"
          >
            Inquire Now
          </button>
        </nav>
      </header>

      {/* Main Body */}
      <main>
        
        {/* Section 1: Immersive Hero Page with sticky video and texts */}
        <section className="relative h-[160vh] w-full bg-transparent">
          {/* Sticky view envelope keeping everything pinned while scrolling */}
          <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

            {/* Background video & ocean radial filters */}
            <div 
              className="absolute inset-0 z-0 select-none"
              style={{
                transform: `scale(1.28) translate(${heroHover.x * -75}px, ${heroHover.y * -75}px)`,
                transition: "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                ref={(el) => { if (el) el.muted = true; }}
                className="w-full h-full object-cover pointer-events-none"
              >
                <source
                  src="https://res.cloudinary.com/dws1zhit2/video/upload/v1779692746/Underwater_environment_luxury_oc__202605251150_gruafj.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            {/* Main Hero Elements */}
            <div 
              style={{
                opacity: Math.max(0, 1 - scrollY / 600),
                transform: `translateY(${Math.min(120, scrollY * 0.25)}px)`,
                pointerEvents: scrollY > 550 ? "none" : "auto",
              }}
              className="absolute bottom-16 sm:bottom-24 left-4 sm:left-16 lg:left-24 z-30 text-left max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 sm:px-0 select-none flex flex-col items-start transition-all duration-100 ease-out"
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
                Enter the Silence
              </h1>
              
              <p className="font-sans text-base sm:text-lg text-brand-on-surface-variant mb-10 leading-relaxed max-w-lg">
                A futuristic ultra-premium sanctuary 300 meters below the surface. Experience the transformative calm of the Pacific abyss.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-start w-full sm:w-auto">
                <button
                  onClick={() => scrollToSection("descent-simulator-section")}
                  className="bg-brand-primary text-brand-on-primary px-10 py-4.5 font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow-[0_0_25px_rgba(0,209,255,0.45)] transition-all duration-300 active:scale-95 btn-glow cursor-pointer text-center"
                >
                  Begin Your Voyage
                </button>
                <button
                  onClick={() => scrollToSection("sanctuary-section")}
                  className="backdrop-blur-md bg-white/5 border border-white/20 text-white px-10 py-4.5 font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-white/10 transition-all duration-300 active:scale-95 cursor-pointer text-center"
                >
                  Explore Penthouses
                </button>
              </div>
            </div>

            {/* Depth Gauge Indicator: Re-positioned to the right above scroll down button, with matching 3D hover effect */}
            <div 
              style={{
                opacity: Math.max(0, 1 - scrollY / 600),
                transform: `translateY(${Math.min(120, scrollY * 0.25)}px) perspective(1000px) rotateX(${heroHover.y * -15}deg) rotateY(${heroHover.x * 15}deg)`,
                transformStyle: "preserve-3d",
                transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className="absolute bottom-28 right-4 sm:right-16 flex items-center gap-4 select-none pointer-events-none z-30"
            >
              <div className="h-32 w-1 bg-brand-outline-variant/30 rounded-full relative overflow-hidden">
                <div className="absolute top-1/4 bottom-0 left-0 w-full bg-brand-primary shadow-[0_0_15px_#4cd6ff]" />
              </div>
              <div className="flex flex-col font-mono text-xs">
                <span className="text-brand-primary font-black text-sm tracking-wider">300M</span>
                <span className="text-brand-on-surface-variant/50">RESORT DEPTH</span>
              </div>
            </div>

            {/* Pulse notification node to guide user, with minor tilt hover */}
            <div 
              style={{
                opacity: Math.max(0, 1 - scrollY / 400),
                transform: `perspective(800px) rotateX(${heroHover.y * -10}deg) rotateY(${heroHover.x * 10}deg)`,
                transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className="absolute bottom-10 right-4 sm:right-16 flex items-center gap-2.5 bg-brand-bg/85 backdrop-blur-md border border-brand-outline-variant/30 px-3.5 py-2 rounded-xl text-[11px] font-mono text-brand-primary tracking-wider animate-bounce cursor-pointer z-30" 
              onClick={() => scrollToSection("sanctuary-section")}
            >
              <span>SCROLL DOWN</span> <ChevronDown className="w-3.5 h-3.5" />
            </div>

          </div>
        </section>

        {/* Section 2: Ocean Floor Penthouses Suite Explorer */}
        <SuiteExplorer
          selectedSuiteId={selectedSuite}
          onSelectSuite={setSelectedSuite}
        />

        {/* Section 3: Sub-aquatic Dining & High-end Wellness */}
        <ExperiencesCollective />

        {/* Section 4: The Silent Ascent/Descent Technical Simulator */}
        <DescentSimulator />

        {/* Section 5: Inquiry & Boarding clearance system */}
        <InquiryForm initialSuitePreference={selectedSuite} />

        {/* Support & Knowledge section (FAQ) */}
        <section id="faq-section" className="py-24 border-t border-brand-outline-variant/10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <HelpIcon className="w-8 h-8 text-brand-primary mx-auto mb-4 glow-icon" />
            <h3 className="font-display text-2xl font-black text-white">Sanctuary Physics FAQ</h3>
            <p className="mt-2 text-brand-on-surface-variant text-sm">
              Answers regarding structural durability, life preservation limits, and atmospheric setups.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-brand-outline-variant/15 bg-brand-surface-low/50 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex justify-between items-center gap-4 text-white hover:text-brand-primary font-sans font-semibold text-sm transition-all"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-brand-outline-variant transition-transform ${isOpen ? "rotate-185" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-brand-on-surface-variant leading-relaxed border-t border-brand-outline-variant/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Luxury Brand Footer */}
      <footer className="bg-brand-surface-container/60 border-t border-brand-outline-variant/10 font-sans text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Logo & Trademark label */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-display text-2xl font-black text-brand-primary tracking-tighter">Aqualis</span>
            <span className="text-[10px] text-brand-on-surface-variant/40 font-mono uppercase tracking-wider">Luxury Deep-Sea Sanctuary</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8 text-brand-on-surface-variant">
            <button onClick={() => alert("Aqualis Privacy Policy has been verified. Secure files encrypted.")} className="hover:text-brand-primary transition-colors cursor-pointer outline-none">Privacy Policy</button>
            <button onClick={() => alert("Terms of Service approved for Launch Clearances.")} className="hover:text-brand-primary transition-colors cursor-pointer outline-none">Terms of Service</button>
            <button onClick={() => alert("Press Kit zip container linked to Secure Assets Server.")} className="hover:text-brand-primary transition-colors cursor-pointer outline-none">Press Kit</button>
            <button onClick={() => scrollToSection("inquiry-section")} className="hover:text-brand-primary transition-colors cursor-pointer outline-none">Contact Us</button>
          </div>

          {/* Copyright node */}
          <div className="text-brand-on-surface-variant/40 font-mono text-[10px] text-center md:text-right">
            © 2026 Aqualis Deep-Sea Resorts. All launch parameters secured.
          </div>

        </div>
      </footer>

    </div>
  );
}
