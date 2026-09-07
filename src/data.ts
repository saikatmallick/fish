import { Suite, Experience, DescentStep } from "./types";

export const SUITES: Suite[] = [
  {
    id: "suite-01",
    name: "Abyssal Suite 01",
    depth: 300,
    tagName: "Midnight Zone Sanctuary",
    description: "Uninterrupted 270° views of the coral shelf and the midnight zone beyond.",
    additionalDetails: "Our flagship penthouse carved directly into ancient basalt. Features a fully reinforced, distortion-free structural dome, private pressure locks, and dual-layer ambient light regulation controllers to replicate lunar tides.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyor0WurLvRwaly923UngPVRtMno1agsLGA1gis2j7m8q89mfStTO41sfoiZrb8VRcg3bZxzUBYEDfGqK8w44Kh3UDidAQf3uBR7f0znYOZJHe3t-lMYXsxV0N6vvOFWo5PMtHSGS--RFWZTVz_BJTXRjndlJxairTsR9hfM6shM0FlyA4Y8RhzscT6ff1KqchcCR1RnpAhtp2acKD4ygoBakJ6p3tQCJ_UAAnkmho7HyrOxbKakA5cAcgCcDspknxVoNU605w4E8",
    highlights: [
      "Triple-reinforced sapphire glass walls",
      "Proprietary hyperbaric ambient pressure adjusting system",
      "In-suite bioluminescent aquatic landscape",
      "Personalized wellness and dietary artisan planner"
    ]
  },
  {
    id: "suite-02",
    name: "Coral Atrium Suite 02",
    depth: 220,
    tagName: "Bioluminescent Reef Sanctuary",
    description: "Vibrant visual access to the living neon coral formations surrounding the active vents.",
    additionalDetails: "Designed with a floating structural deck suspended above the deep-sea reef lagoon. Watch gentle siphonophores and pale crystalline hydras expand in silent luminescence against the black water.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiYMXiz9_j4T_vTfqa92-b4jySjz0aDXxmA_n7m7wpJjVQ3Nvsq56VVpR0ALt-j0qIhTUENtLINMWWlMAfjPD__8c2HtKFJH2Ccs2SvSQ_Gm0d97RAbxaotXNC92SIkv-HFJjo_Uj2zE1ddGyT8rXckQ8YAnZAM1hmKKn4Rg0cFU7pNTA6qqwzVlA9I6yR5fYnJtWmeLgCAp6Y3K87OPffx82FogWVTnSYxkgkT14QtI9v1jVgCsNlikr81fBvLlbYdDN-lfQpWo4",
    highlights: [
      "Bioluminescent reef shelf observation pane",
      "Soft bio-organic active ambient lighting system",
      "Direct integration with the Deep Calm health unit",
      "Oxygen levels matched to ancient alpine peaks"
    ]
  },
  {
    id: "suite-03",
    name: "Twilight Grand Deck 03",
    depth: 120,
    tagName: "Pelagic Migration Observatory",
    description: "Positioned directly in the pelagic migration path of blue whales and colossal squids.",
    additionalDetails: "Perched near the edge of the continental shelf, this suite is wrapped in multi-pane panoramic structural composites that maximize natural light during upper-ocean transitions. Ideal for watching pelagic migrations.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBp7__8Y9KFkusrQFGP6VY3xAuB7Fkwi2QshkkUiccoSBKKtLwL0EkNYQXyI-411aduYCkq523QVk7oCBgguAr1EwEXswebXQDsvXAGDuqQDfp0O08ucWUoFZrP81wSgbxY6BcNOf5FMxTHVPQUD2IVaKpXkzR4laQ_09dGxr4FgM_hBUYhDg3FMpClUE8OQM8YtLDWAOD8HBPoh4gHIxD3WfTkNhbmqRepWdC1ZGpq5Q-DWs-Z-bqeB1EcUbJ6nkdrXlupvUVibvk",
    highlights: [
      "Ultra-wide 360° celestial composite viewport",
      "Hydrophone sensory suite to listen to active mammal communications",
      "Pressurized stargazing dome directly above the suite",
      "Thermostable copper convection warming system"
    ]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-01",
    title: "Lumina Lounge",
    tagline: "Bioluminescent gastronomy by Michelin-starred artisans.",
    description: "Savor masterfully crafted creations that emit natural, safe bioluminescent light under precise culinary control. Dishes leverage cold-pressed marine plant structures, rare deep-sea mineral reductions, and sustainable high-depth resources to deliver an entirely unique sense of taste and sight.",
    highlights: [
      "12-course underwater structural tasting menu",
      "Naturally glowing active cocktails",
      "Acoustics dampened via custom-carved volcanic rock panels",
      "Sommelier pairings curated for deep-sea atmospheric conditions"
    ],
    ambientColor: "rgba(164, 230, 255, 0.1)",
    temperature: "18°C"
  },
  {
    id: "exp-02",
    title: "Deep Calm Spa",
    tagline: "Hyperbaric hydrotherapy and mineral-infused thermal treatments.",
    description: "Experience absolute physical restoration with pressurized hot spring waters. Rich in basalt-filtered calcium, silica, and dynamic trace elements harvested from nearby ocean thermal vents, these mineral baths relieve all surface-world gravity fatigue while improving metabolic recovery.",
    highlights: [
      "Signature 3.0-atmosphere deep oxygen pool",
      "Laminated volcanic clay and thermal mud wraps",
      "Zero-gravity neutral buoyancy flotation tanks",
      "Infrared heat therapies with acoustic vibration pads"
    ],
    ambientColor: "rgba(183, 196, 255, 0.1)",
    temperature: "38°C"
  },
  {
    id: "exp-03",
    title: "The Abyss Gallery",
    tagline: "A curated digital art installation synced with living deep-marine movements.",
    description: "Immerse yourself in fluid dynamic projections and spatial arrays that translate live hydrophone frequencies, sea currents, and biological telemetry outside the glass into generative art. Witness the ocean's silent pulse rendered into beautiful, glowing architectural light lines.",
    highlights: [
      "Generative deep neural network laser projectors",
      "Live ocean floor sonar audio spatializer",
      "Interactive kinetic structures responsive to whale pulses",
      "Exclusive curated exhibits by visionary digital artisans"
    ],
    ambientColor: "rgba(154, 234, 228, 0.1)",
    temperature: "21°C"
  }
];

export const DESCENT_STEPS: DescentStep[] = [
  {
    id: 1,
    title: "Private Submersible",
    description: "Your voyage begins with a private, glass-domed submersible launch from our secure coastal port.",
    fromDepth: 0,
    toDepth: 100,
    pressureRange: "1.0 - 10.0 atm",
    durationString: "7 mins"
  },
  {
    id: 2,
    title: "Gradual Immersion",
    description: "Experience a 20-minute calibrated descent through the twilight zone into the absolute midnight sanctuary.",
    fromDepth: 100,
    toDepth: 250,
    pressureRange: "10.0 - 25.0 atm",
    durationString: "10 mins"
  },
  {
    id: 3,
    title: "Airlock Arrival",
    description: "Seamless docking into the main high-pressure atrium, where sublime silence becomes your host.",
    fromDepth: 250,
    toDepth: 300,
    pressureRange: "30.0 atm (Stabilized)",
    durationString: "3 mins"
  }
];
