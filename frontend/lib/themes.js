// themes.js — chaque thème embarque ses polices Google Fonts + couleurs affinées

export const THEMES = {
  /* ── DARK / TECH ────────────────────────────────── */

  minimal_dark_soft: {
    id: "minimal_dark_soft",
    label: "Minimal Dark",
    style: "boutique moderne",
    fonts: {
      display: "Syne",
      body: "DM Sans",
      import:
        "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#818CF8",
      accent: "#C4B5FD",
      highlight: "#E0E7FF",
      background: "#0F0F1A",
      surface: "rgba(30,30,50,0.70)",
      card: "rgba(40,40,65,0.75)",
      border: "rgba(129,140,248,0.15)",
      text: "#F1F5F9",
      textMuted: "#94A3B8",
      btn: "#818CF8",
      btnText: "#0F0F1A",
      btnHover: "#6366F1",
    },
  },

  zecks_dark_pro: {
    id: "zecks_dark_pro",
    label: "Dark Pro",
    style: "smartphone premium",
    fonts: {
      display: "Space Grotesk",
      body: "Outfit",
      import:
        "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Outfit:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#7C3AED",
      accent: "#06B6D4",
      highlight: "#A78BFA",
      background: "#080C14",
      surface: "rgba(20,28,50,0.72)",
      card: "rgba(28,38,66,0.70)",
      border: "rgba(124,58,237,0.18)",
      text: "#F8FAFC",
      textMuted: "#94A3B8",
      btn: "#7C3AED",
      btnText: "#ffffff",
      btnHover: "#6D28D9",
    },
  },

  midnight_glass: {
    id: "midnight_glass",
    label: "Midnight Glass",
    style: "glassmorphism tech",
    fonts: {
      display: "Rajdhani",
      body: "Exo 2",
      import:
        "https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Exo+2:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#22D3EE",
      accent: "#6EE7B7",
      highlight: "#A5F3FC",
      background: "#020617",
      surface: "rgba(255,255,255,0.04)",
      card: "rgba(255,255,255,0.07)",
      border: "rgba(34,211,238,0.18)",
      text: "#E2E8F0",
      textMuted: "#64748B",
      btn: "#22D3EE",
      btnText: "#020617",
      btnHover: "#0891B2",
    },
  },

  neon_tech: {
    id: "neon_tech",
    label: "Neon Tech",
    style: "gaming / gadgets",
    fonts: {
      display: "Orbitron",
      body: "Rajdhani",
      import:
        "https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#00FFA3",
      accent: "#00E5FF",
      highlight: "#39FF14",
      background: "#050505",
      surface: "rgba(0,255,163,0.06)",
      card: "rgba(0,255,163,0.09)",
      border: "rgba(0,255,163,0.22)",
      text: "#E5E7EB",
      textMuted: "#6B7280",
      btn: "#00FFA3",
      btnText: "#050505",
      btnHover: "#00CC82",
    },
  },

  luxury_phone: {
    id: "luxury_phone",
    label: "Luxury Phone",
    style: "smartphone haut de gamme",
    fonts: {
      display: "Cormorant Garamond",
      body: "Jost",
      import:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@300;400;500&display=swap",
    },
    colors: {
      primary: "#D4B483",
      accent: "#8B7355",
      highlight: "#F0DEB0",
      background: "#0C0C0C",
      surface: "#161616",
      card: "#1E1E1E",
      border: "rgba(212,180,131,0.12)",
      text: "#F5F5F0",
      textMuted: "#888880",
      btn: "#D4B483",
      btnText: "#0C0C0C",
      btnHover: "#B8965A",
    },
  },

  royal_gold: {
    id: "royal_gold",
    label: "Royal Gold",
    style: "luxury classic",
    fonts: {
      display: "Playfair Display",
      body: "Lato",
      import:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700&display=swap",
    },
    colors: {
      primary: "#D4AF37",
      accent: "#F1D476",
      highlight: "#FFF8DC",
      background: "#0A0A08",
      surface: "rgba(212,175,55,0.06)",
      card: "rgba(212,175,55,0.09)",
      border: "rgba(212,175,55,0.22)",
      text: "#F5F5F0",
      textMuted: "#A89060",
      btn: "#D4AF37",
      btnText: "#0A0A08",
      btnHover: "#B8960F",
    },
  },

  eclipse_black: {
    id: "eclipse_black",
    label: "Eclipse Black",
    style: "void dark",
    fonts: {
      display: "Bebas Neue",
      body: "Barlow",
      import:
        "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&display=swap",
    },
    colors: {
      primary: "#E5E5E5",
      accent: "#FFFFFF",
      highlight: "#CCCCCC",
      background: "#000000",
      surface: "rgba(30,30,30,0.80)",
      card: "rgba(22,22,22,0.90)",
      border: "rgba(255,255,255,0.08)",
      text: "#F5F5F5",
      textMuted: "#888888",
      btn: "#FFFFFF",
      btnText: "#000000",
      btnHover: "#CCCCCC",
    },
  },

  cyber_blue: {
    id: "cyber_blue",
    label: "Cyber Blue",
    style: "tech futuriste",
    fonts: {
      display: "Exo 2",
      body: "Exo 2",
      import:
        "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;800&display=swap",
    },
    colors: {
      primary: "#00C9FF",
      accent: "#0077B6",
      highlight: "#90E0EF",
      background: "#02052E",
      surface: "rgba(0,201,255,0.07)",
      card: "rgba(0,119,182,0.12)",
      border: "rgba(0,201,255,0.20)",
      text: "#CAF0F8",
      textMuted: "#7EC8E3",
      btn: "#00C9FF",
      btnText: "#02052E",
      btnHover: "#0096C7",
    },
  },

  abyss_deep: {
    id: "abyss_deep",
    label: "Abyss Deep",
    style: "dark oceanic",
    fonts: {
      display: "Teko",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Teko:wght@600;700&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#0096C7",
      accent: "#48CAE4",
      highlight: "#90E0EF",
      background: "#020B3A",
      surface: "rgba(0,96,199,0.14)",
      card: "rgba(0,150,199,0.12)",
      border: "rgba(72,202,228,0.18)",
      text: "#CAF0F8",
      textMuted: "#5BC0DE",
      btn: "#0096C7",
      btnText: "#ffffff",
      btnHover: "#0077B6",
    },
  },

  volcanic_ash: {
    id: "volcanic_ash",
    label: "Volcanic Ash",
    style: "dark industrial",
    fonts: {
      display: "Barlow Condensed",
      body: "Barlow",
      import:
        "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#FF4500",
      accent: "#FF6B35",
      highlight: "#FF8C69",
      background: "#111111",
      surface: "rgba(255,69,0,0.09)",
      card: "rgba(255,107,53,0.08)",
      border: "rgba(255,69,0,0.18)",
      text: "#EEEEEE",
      textMuted: "#AAAAAA",
      btn: "#FF4500",
      btnText: "#ffffff",
      btnHover: "#CC3700",
    },
  },

  wine_cellar: {
    id: "wine_cellar",
    label: "Wine Cellar",
    style: "rich red",
    fonts: {
      display: "Playfair Display",
      body: "Crimson Text",
      import:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Crimson+Text:wght@400;600&display=swap",
    },
    colors: {
      primary: "#9B2335",
      accent: "#C0392B",
      highlight: "#E74C3C",
      background: "#1A0A0D",
      surface: "rgba(155,35,53,0.14)",
      card: "rgba(192,57,43,0.10)",
      border: "rgba(231,76,60,0.20)",
      text: "#FAEBD7",
      textMuted: "#C4958E",
      btn: "#9B2335",
      btnText: "#FAEBD7",
      btnHover: "#7A1C29",
    },
  },

  ruby_red: {
    id: "ruby_red",
    label: "Ruby Red",
    style: "passion bold",
    fonts: {
      display: "Oswald",
      body: "Source Sans 3",
      import:
        "https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Source+Sans+3:wght@400;600&display=swap",
    },
    colors: {
      primary: "#E01050",
      accent: "#FF4D6D",
      highlight: "#FF8FA3",
      background: "#1A0008",
      surface: "rgba(224,16,80,0.09)",
      card: "rgba(255,77,109,0.08)",
      border: "rgba(255,143,163,0.18)",
      text: "#FFF0F3",
      textMuted: "#FF9EB5",
      btn: "#E01050",
      btnText: "#ffffff",
      btnHover: "#B3003E",
    },
  },

  galaxy_purple: {
    id: "galaxy_purple",
    label: "Galaxy Purple",
    style: "space deep",
    fonts: {
      display: "Syne",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#8B5CF6",
      accent: "#A78BFA",
      highlight: "#DDD6FE",
      background: "#09000F",
      surface: "rgba(139,92,246,0.10)",
      card: "rgba(167,139,250,0.08)",
      border: "rgba(221,214,254,0.14)",
      text: "#F3E8FF",
      textMuted: "#C4B5FD",
      btn: "#8B5CF6",
      btnText: "#ffffff",
      btnHover: "#7C3AED",
    },
  },

  midnight_blue: {
    id: "midnight_blue",
    label: "Midnight Blue",
    style: "deep night",
    fonts: {
      display: "Raleway",
      body: "Open Sans",
      import:
        "https://fonts.googleapis.com/css2?family=Raleway:wght@700;800&family=Open+Sans:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#3B82F6",
      accent: "#60A5FA",
      highlight: "#93C5FD",
      background: "#060B1E",
      surface: "rgba(59,130,246,0.10)",
      card: "rgba(96,165,250,0.08)",
      border: "rgba(147,197,253,0.15)",
      text: "#EFF6FF",
      textMuted: "#93C5FD",
      btn: "#3B82F6",
      btnText: "#ffffff",
      btnHover: "#2563EB",
    },
  },

  twilight_purple: {
    id: "twilight_purple",
    label: "Twilight Purple",
    style: "evening calm",
    fonts: {
      display: "Josefin Sans",
      body: "Mulish",
      import:
        "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600;700&family=Mulish:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#9333EA",
      accent: "#A855F7",
      highlight: "#D8B4FE",
      background: "#0E001A",
      surface: "rgba(147,51,234,0.12)",
      card: "rgba(168,85,247,0.09)",
      border: "rgba(216,180,254,0.16)",
      text: "#FAF5FF",
      textMuted: "#C084FC",
      btn: "#9333EA",
      btnText: "#ffffff",
      btnHover: "#7E22CE",
    },
  },

  solar_flare: {
    id: "solar_flare",
    label: "Solar Flare",
    style: "energy bright",
    fonts: {
      display: "Chakra Petch",
      body: "Manrope",
      import:
        "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Manrope:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#F97316",
      accent: "#FB923C",
      highlight: "#FED7AA",
      background: "#1A0E00",
      surface: "rgba(249,115,22,0.10)",
      card: "rgba(251,146,60,0.09)",
      border: "rgba(254,215,170,0.15)",
      text: "#FFF7ED",
      textMuted: "#FBB061",
      btn: "#F97316",
      btnText: "#ffffff",
      btnHover: "#EA580C",
    },
  },

  amber_glow: {
    id: "amber_glow",
    label: "Amber Glow",
    style: "warm light",
    fonts: {
      display: "Abril Fatface",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#F59E0B",
      accent: "#FBBF24",
      highlight: "#FDE68A",
      background: "#1C1500",
      surface: "rgba(245,158,11,0.08)",
      card: "rgba(251,191,36,0.08)",
      border: "rgba(253,230,138,0.15)",
      text: "#FFFBEB",
      textMuted: "#FCD34D",
      btn: "#F59E0B",
      btnText: "#1C1500",
      btnHover: "#D97706",
    },
  },

  hologram_silver: {
    id: "hologram_silver",
    label: "Hologram",
    style: "futuristic light",
    fonts: {
      display: "Rajdhani",
      body: "Barlow",
      import:
        "https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Barlow:wght@400;500&display=swap",
    },
    colors: {
      primary: "#D1D5DB",
      accent: "#9CA3AF",
      highlight: "#F9FAFB",
      background: "#060606",
      surface: "rgba(255,255,255,0.05)",
      card: "rgba(255,255,255,0.07)",
      border: "rgba(255,255,255,0.12)",
      text: "#F9FAFB",
      textMuted: "#9CA3AF",
      btn: "#D1D5DB",
      btnText: "#060606",
      btnHover: "#9CA3AF",
    },
  },

  moonlight_silver: {
    id: "moonlight_silver",
    label: "Moonlight",
    style: "nocturnal cool",
    fonts: {
      display: "Libre Baskerville",
      body: "Source Sans 3",
      import:
        "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=Source+Sans+3:wght@400;600&display=swap",
    },
    colors: {
      primary: "#CBD5E1",
      accent: "#94A3B8",
      highlight: "#E2E8F0",
      background: "#0D0D0D",
      surface: "rgba(203,213,225,0.06)",
      card: "rgba(148,163,184,0.08)",
      border: "rgba(226,232,240,0.10)",
      text: "#F1F5F9",
      textMuted: "#94A3B8",
      btn: "#CBD5E1",
      btnText: "#0D0D0D",
      btnHover: "#94A3B8",
    },
  },

  coffee_beans: {
    id: "coffee_beans",
    label: "Coffee Beans",
    style: "roast dark",
    fonts: {
      display: "Playfair Display",
      body: "Lora",
      import:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:wght@400;500&display=swap",
    },
    colors: {
      primary: "#8B5E3C",
      accent: "#C4895A",
      highlight: "#E8C4A0",
      background: "#1A0E08",
      surface: "rgba(139,94,60,0.14)",
      card: "rgba(196,137,90,0.10)",
      border: "rgba(232,196,160,0.15)",
      text: "#FDF6EE",
      textMuted: "#C4956A",
      btn: "#8B5E3C",
      btnText: "#FDF6EE",
      btnHover: "#704C30",
    },
  },

  /* ── LIGHT / SOFT ────────────────────────────── */

  ios_clean: {
    id: "ios_clean",
    label: "iOS Clean",
    style: "apple minimal",
    fonts: {
      display: "Plus Jakarta Sans",
      body: "Plus Jakarta Sans",
      import:
        "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
    },
    colors: {
      primary: "#007AFF",
      accent: "#34C759",
      highlight: "#5AC8FA",
      background: "#F2F2F7",
      surface: "rgba(255,255,255,0.78)",
      card: "#FFFFFF",
      border: "#E5E5EA",
      text: "#1C1C1E",
      textMuted: "#6D6D72",
      btn: "#007AFF",
      btnText: "#ffffff",
      btnHover: "#0056CC",
    },
  },

  pure_white: {
    id: "pure_white",
    label: "Pure White",
    style: "ultra minimal",
    fonts: {
      display: "Syne",
      body: "Epilogue",
      import:
        "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Epilogue:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#111827",
      accent: "#374151",
      highlight: "#6B7280",
      background: "#FFFFFF",
      surface: "#FFFFFF",
      card: "#FAFAFA",
      border: "#E5E7EB",
      text: "#111827",
      textMuted: "#6B7280",
      btn: "#111827",
      btnText: "#ffffff",
      btnHover: "#000000",
    },
  },

  titanium_white: {
    id: "titanium_white",
    label: "Titanium",
    style: "clean strong",
    fonts: {
      display: "Manrope",
      body: "Manrope",
      import:
        "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
    },
    colors: {
      primary: "#1F2937",
      accent: "#4B5563",
      highlight: "#D1D5DB",
      background: "#F9FAFB",
      surface: "#FFFFFF",
      card: "#FFFFFF",
      border: "#E5E7EB",
      text: "#111827",
      textMuted: "#6B7280",
      btn: "#1F2937",
      btnText: "#ffffff",
      btnHover: "#111827",
    },
  },

  desert_dune: {
    id: "desert_dune",
    label: "Desert Dune",
    style: "warm earth",
    fonts: {
      display: "Libre Baskerville",
      body: "Lato",
      import:
        "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@700&family=Lato:wght@300;400;700&display=swap",
    },
    colors: {
      primary: "#B5651D",
      accent: "#CD853F",
      highlight: "#DEB887",
      background: "#FDF6EC",
      surface: "rgba(255,255,255,0.70)",
      card: "#FFFFFF",
      border: "#E8D8C0",
      text: "#4A2E0F",
      textMuted: "#8B6347",
      btn: "#B5651D",
      btnText: "#ffffff",
      btnHover: "#8B4513",
    },
  },

  vintage_sepia: {
    id: "vintage_sepia",
    label: "Vintage Sepia",
    style: "retro paper",
    fonts: {
      display: "Playfair Display",
      body: "Lora",
      import:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lora:wght@400;500&display=swap",
    },
    colors: {
      primary: "#6B3A1F",
      accent: "#A0784B",
      highlight: "#D2B48C",
      background: "#F7EDD8",
      surface: "rgba(255,255,255,0.55)",
      card: "#FFF8EE",
      border: "#D8C0A0",
      text: "#3A2210",
      textMuted: "#6B5040",
      btn: "#6B3A1F",
      btnText: "#F7EDD8",
      btnHover: "#4F2A16",
    },
  },

  champagne_bubbles: {
    id: "champagne_bubbles",
    label: "Champagne",
    style: "celebration",
    fonts: {
      display: "Cormorant Garamond",
      body: "Jost",
      import:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&family=Jost:wght@300;400;500&display=swap",
    },
    colors: {
      primary: "#B8962E",
      accent: "#D4AF37",
      highlight: "#F0E080",
      background: "#FDFAF3",
      surface: "rgba(255,255,255,0.85)",
      card: "#FFFFFF",
      border: "#EDD99A",
      text: "#3D2E10",
      textMuted: "#6B5730",
      btn: "#B8962E",
      btnText: "#FDFAF3",
      btnHover: "#8F7222",
    },
  },

  arctic_ice: {
    id: "arctic_ice",
    label: "Arctic Ice",
    style: "frozen clean",
    fonts: {
      display: "Josefin Sans",
      body: "Mulish",
      import:
        "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600;700&family=Mulish:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#4A90D9",
      accent: "#7EB8EF",
      highlight: "#BEE3F8",
      background: "#EFF5FD",
      surface: "rgba(255,255,255,0.75)",
      card: "#FFFFFF",
      border: "#C9DFEF",
      text: "#1A3A52",
      textMuted: "#4A7A9B",
      btn: "#4A90D9",
      btnText: "#ffffff",
      btnHover: "#2A70B8",
    },
  },

  ocean_breeze: {
    id: "ocean_breeze",
    label: "Ocean Breeze",
    style: "coastal light",
    fonts: {
      display: "Raleway",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Raleway:wght@700;800&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#0891B2",
      accent: "#38BDF8",
      highlight: "#7DD3FC",
      background: "#ECFEFF",
      surface: "rgba(255,255,255,0.72)",
      card: "#FFFFFF",
      border: "#BAE6FD",
      text: "#0C4A6E",
      textMuted: "#0369A1",
      btn: "#0891B2",
      btnText: "#ffffff",
      btnHover: "#0E7490",
    },
  },

  emerald_city: {
    id: "emerald_city",
    label: "Emerald City",
    style: "vibrant green",
    fonts: {
      display: "Outfit",
      body: "Outfit",
      import:
        "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap",
    },
    colors: {
      primary: "#059669",
      accent: "#34D399",
      highlight: "#A7F3D0",
      background: "#ECFDF5",
      surface: "rgba(255,255,255,0.75)",
      card: "#FFFFFF",
      border: "#BBF7D0",
      text: "#064E3B",
      textMuted: "#047857",
      btn: "#059669",
      btnText: "#ffffff",
      btnHover: "#047857",
    },
  },

  forest_canopy: {
    id: "forest_canopy",
    label: "Forest Canopy",
    style: "nature dense",
    fonts: {
      display: "Abril Fatface",
      body: "Lato",
      import:
        "https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Lato:wght@300;400;700&display=swap",
    },
    colors: {
      primary: "#2D6A4F",
      accent: "#52B788",
      highlight: "#B7E4C7",
      background: "#1B4332",
      surface: "rgba(27,67,50,0.72)",
      card: "rgba(45,106,79,0.45)",
      border: "rgba(82,183,136,0.22)",
      text: "#D8F3DC",
      textMuted: "#74C69D",
      btn: "#52B788",
      btnText: "#1B4332",
      btnHover: "#40916C",
    },
  },

  lavender_mist: {
    id: "lavender_mist",
    label: "Lavender Mist",
    style: "calm purple",
    fonts: {
      display: "Josefin Sans",
      body: "Mulish",
      import:
        "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600;700&family=Mulish:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#7C3AED",
      accent: "#A78BFA",
      highlight: "#EDE9FE",
      background: "#FAF8FF",
      surface: "rgba(255,255,255,0.82)",
      card: "#FFFFFF",
      border: "#DDD6FE",
      text: "#3B0764",
      textMuted: "#7C3AED",
      btn: "#7C3AED",
      btnText: "#ffffff",
      btnHover: "#6D28D9",
    },
  },

  cherry_blossom: {
    id: "cherry_blossom",
    label: "Cherry Blossom",
    style: "spring soft",
    fonts: {
      display: "Cormorant Garamond",
      body: "Lato",
      import:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=Lato:wght@300;400;700&display=swap",
    },
    colors: {
      primary: "#E879A0",
      accent: "#F9A8C9",
      highlight: "#FCE7F3",
      background: "#FFF7FB",
      surface: "rgba(255,255,255,0.82)",
      card: "#FFFFFF",
      border: "#FBCFE8",
      text: "#831843",
      textMuted: "#BE185D",
      btn: "#E879A0",
      btnText: "#ffffff",
      btnHover: "#DB2777",
    },
  },

  /* ── FOOD & LIFESTYLE ─────────────────────────── */

  minty_fresh: {
    id: "minty_fresh",
    label: "Minty Fresh",
    style: "pharmacie / hygiene",
    fonts: {
      display: "Plus Jakarta Sans",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#10B981",
      accent: "#34D399",
      highlight: "#A7F3D0",
      background: "#F0FFFA",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#D1FAE5",
      text: "#064E3B",
      textMuted: "#059669",
      btn: "#10B981",
      btnText: "#ffffff",
      btnHover: "#059669",
    },
  },

  coral_soft: {
    id: "coral_soft",
    label: "Coral Soft",
    style: "restaurant",
    fonts: {
      display: "Oswald",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#F43F5E",
      accent: "#FB7185",
      highlight: "#FECDD3",
      background: "#FFF5F6",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#FECDD3",
      text: "#881337",
      textMuted: "#BE123C",
      btn: "#F43F5E",
      btnText: "#ffffff",
      btnHover: "#E11D48",
    },
  },

  fresh_orange: {
    id: "fresh_orange",
    label: "Fresh Orange",
    style: "juice bar",
    fonts: {
      display: "Fredoka One",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#F97316",
      accent: "#FB923C",
      highlight: "#FED7AA",
      background: "#FFF8F3",
      surface: "rgba(255,255,255,0.90)",
      card: "#FFFFFF",
      border: "#FDBA74",
      text: "#7C2D12",
      textMuted: "#C2410C",
      btn: "#F97316",
      btnText: "#ffffff",
      btnHover: "#EA580C",
    },
  },

  mango_smooth: {
    id: "mango_smooth",
    label: "Mango Smooth",
    style: "smoothie",
    fonts: {
      display: "Fredoka One",
      body: "Quicksand",
      import:
        "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#EAB308",
      accent: "#FBBF24",
      highlight: "#FDE68A",
      background: "#FEFCE8",
      surface: "rgba(255,255,255,0.90)",
      card: "#FFFFFF",
      border: "#FEF9C3",
      text: "#713F12",
      textMuted: "#A16207",
      btn: "#EAB308",
      btnText: "#713F12",
      btnHover: "#CA8A04",
    },
  },

  matcha_latte: {
    id: "matcha_latte",
    label: "Matcha Latte",
    style: "green tea",
    fonts: {
      display: "Noto Serif JP",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#65A30D",
      accent: "#84CC16",
      highlight: "#D9F99D",
      background: "#F7FEE7",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#E2F0CB",
      text: "#365314",
      textMuted: "#4D7C0F",
      btn: "#65A30D",
      btnText: "#ffffff",
      btnHover: "#4D7C0F",
    },
  },

  vanilla_cream: {
    id: "vanilla_cream",
    label: "Vanilla Cream",
    style: "dessert",
    fonts: {
      display: "Pacifico",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Pacifico&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#D97706",
      accent: "#F59E0B",
      highlight: "#FDE68A",
      background: "#FFFBF0",
      surface: "rgba(255,255,255,0.92)",
      card: "#FFFFFF",
      border: "#FEF3C7",
      text: "#78350F",
      textMuted: "#A16207",
      btn: "#D97706",
      btnText: "#ffffff",
      btnHover: "#B45309",
    },
  },

  chocolate_delight: {
    id: "chocolate_delight",
    label: "Chocolate",
    style: "rich brown",
    fonts: {
      display: "Abril Fatface",
      body: "Lora",
      import:
        "https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Lora:wght@400;500&display=swap",
    },
    colors: {
      primary: "#92400E",
      accent: "#B45309",
      highlight: "#D97706",
      background: "#FDF8F5",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#D6C4B0",
      text: "#3E2311",
      textMuted: "#6B4226",
      btn: "#92400E",
      btnText: "#ffffff",
      btnHover: "#78350F",
    },
  },

  caramel_swirl: {
    id: "caramel_swirl",
    label: "Caramel Swirl",
    style: "sweet brown",
    fonts: {
      display: "Pacifico",
      body: "Lato",
      import:
        "https://fonts.googleapis.com/css2?family=Pacifico&family=Lato:wght@300;400;700&display=swap",
    },
    colors: {
      primary: "#B45309",
      accent: "#D97706",
      highlight: "#FDE68A",
      background: "#FFFCF5",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#FEF3C7",
      text: "#78350F",
      textMuted: "#92400E",
      btn: "#B45309",
      btnText: "#ffffff",
      btnHover: "#92400E",
    },
  },

  /* ── BEAUTY / LIFESTYLE ───────────────────────── */

  blush_shop: {
    id: "blush_shop",
    label: "Blush Shop",
    style: "beauty",
    fonts: {
      display: "Cormorant Garamond",
      body: "Jost",
      import:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=Jost:wght@300;400;500&display=swap",
    },
    colors: {
      primary: "#E11D48",
      accent: "#FB7185",
      highlight: "#FECDD3",
      background: "#FFF5F7",
      surface: "rgba(255,255,255,0.90)",
      card: "#FFFFFF",
      border: "#FFE4E6",
      text: "#881337",
      textMuted: "#9F1239",
      btn: "#E11D48",
      btnText: "#ffffff",
      btnHover: "#BE123C",
    },
  },

  lavender_soft: {
    id: "lavender_soft",
    label: "Lavender Soft",
    style: "cosmetique",
    fonts: {
      display: "Cormorant Garamond",
      body: "Mulish",
      import:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Mulish:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#8B5CF6",
      accent: "#C4B5FD",
      highlight: "#EDE9FE",
      background: "#FAF8FF",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#EDE9FE",
      text: "#4C1D95",
      textMuted: "#7C3AED",
      btn: "#8B5CF6",
      btnText: "#ffffff",
      btnHover: "#7C3AED",
    },
  },

  rose_gold_light: {
    id: "rose_gold_light",
    label: "Rose Gold",
    style: "luxe doux",
    fonts: {
      display: "Cormorant Garamond",
      body: "Jost",
      import:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=Jost:wght@300;400;500&display=swap",
    },
    colors: {
      primary: "#C4726B",
      accent: "#D4958E",
      highlight: "#F5D0CC",
      background: "#FFF8F7",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#FAD4CF",
      text: "#6B2020",
      textMuted: "#9A4040",
      btn: "#C4726B",
      btnText: "#ffffff",
      btnHover: "#A85A54",
    },
  },

  aqua_soft: {
    id: "aqua_soft",
    label: "Aqua Soft",
    style: "spa",
    fonts: {
      display: "Josefin Sans",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600;700&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#0891B2",
      accent: "#22D3EE",
      highlight: "#CFFAFE",
      background: "#F5FEFF",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#CFFAFE",
      text: "#164E63",
      textMuted: "#0E7490",
      btn: "#0891B2",
      btnText: "#ffffff",
      btnHover: "#0E7490",
    },
  },

  bubblegum_fun: {
    id: "bubblegum_fun",
    label: "Bubblegum",
    style: "kids",
    fonts: {
      display: "Fredoka One",
      body: "Quicksand",
      import:
        "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@400;500;600;700&display=swap",
    },
    colors: {
      primary: "#EC4899",
      accent: "#F9A8D4",
      highlight: "#FCE7F3",
      background: "#FFF6FA",
      surface: "rgba(255,255,255,0.90)",
      card: "#FFFFFF",
      border: "#FBCFE8",
      text: "#831843",
      textMuted: "#9D174D",
      btn: "#EC4899",
      btnText: "#ffffff",
      btnHover: "#DB2777",
    },
  },

  cotton_candy: {
    id: "cotton_candy",
    label: "Cotton Candy",
    style: "dessert fun",
    fonts: {
      display: "Fredoka One",
      body: "Quicksand",
      import:
        "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#C026D3",
      accent: "#E879F9",
      highlight: "#F5D0FE",
      background: "#FEF0FF",
      surface: "rgba(255,255,255,0.90)",
      card: "#FFFFFF",
      border: "#F5D0FE",
      text: "#701A75",
      textMuted: "#9333EA",
      btn: "#C026D3",
      btnText: "#ffffff",
      btnHover: "#A21CAF",
    },
  },

  /* ── PRO / TECH ───────────────────────────────── */

  clinic_light: {
    id: "clinic_light",
    label: "Clinic Light",
    style: "clinique",
    fonts: {
      display: "Plus Jakarta Sans",
      body: "Plus Jakarta Sans",
      import:
        "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
    },
    colors: {
      primary: "#0284C7",
      accent: "#0EA5E9",
      highlight: "#7DD3FC",
      background: "#F0F9FF",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#BAE6FD",
      text: "#0C4A6E",
      textMuted: "#0369A1",
      btn: "#0284C7",
      btnText: "#ffffff",
      btnHover: "#0369A1",
    },
  },

  herb_green: {
    id: "herb_green",
    label: "Herb Green",
    style: "phytotherapie",
    fonts: {
      display: "Outfit",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Outfit:wght@700;800&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#16A34A",
      accent: "#4ADE80",
      highlight: "#BBF7D0",
      background: "#F0FFF6",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#D1FAE5",
      text: "#14532D",
      textMuted: "#166534",
      btn: "#16A34A",
      btnText: "#ffffff",
      btnHover: "#15803D",
    },
  },

  olive_nature: {
    id: "olive_nature",
    label: "Olive Nature",
    style: "bio",
    fonts: {
      display: "Playfair Display",
      body: "Source Sans 3",
      import:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;600&display=swap",
    },
    colors: {
      primary: "#4D7C0F",
      accent: "#84CC16",
      highlight: "#D9F99D",
      background: "#F7FFF0",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#ECFCCB",
      text: "#365314",
      textMuted: "#3F6212",
      btn: "#4D7C0F",
      btnText: "#ffffff",
      btnHover: "#3F6212",
    },
  },

  sky_breeze: {
    id: "sky_breeze",
    label: "Sky Breeze",
    style: "clean tech",
    fonts: {
      display: "Manrope",
      body: "Manrope",
      import:
        "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
    },
    colors: {
      primary: "#0369A1",
      accent: "#38BDF8",
      highlight: "#E0F2FE",
      background: "#F5FBFF",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#BAE6FD",
      text: "#0C4A6E",
      textMuted: "#0284C7",
      btn: "#0369A1",
      btnText: "#ffffff",
      btnHover: "#075985",
    },
  },

  clean_teal: {
    id: "clean_teal",
    label: "Clean Teal",
    style: "modern pro",
    fonts: {
      display: "Plus Jakarta Sans",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#0D9488",
      accent: "#14B8A6",
      highlight: "#99F6E4",
      background: "#F0FDFA",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#CCFBF1",
      text: "#134E4A",
      textMuted: "#0F766E",
      btn: "#0D9488",
      btnText: "#ffffff",
      btnHover: "#0F766E",
    },
  },

  light_indigo: {
    id: "light_indigo",
    label: "Light Indigo",
    style: "tech clean",
    fonts: {
      display: "Syne",
      body: "Epilogue",
      import:
        "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Epilogue:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#4F46E5",
      accent: "#818CF8",
      highlight: "#C7D2FE",
      background: "#F5F7FF",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#E0E7FF",
      text: "#1E1B4B",
      textMuted: "#4F46E5",
      btn: "#4F46E5",
      btnText: "#ffffff",
      btnHover: "#4338CA",
    },
  },

  clean_gray: {
    id: "clean_gray",
    label: "Clean Gray",
    style: "pro minimal",
    fonts: {
      display: "Epilogue",
      body: "Epilogue",
      import:
        "https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800&display=swap",
    },
    colors: {
      primary: "#374151",
      accent: "#6B7280",
      highlight: "#D1D5DB",
      background: "#FAFAFA",
      surface: "#FFFFFF",
      card: "#FFFFFF",
      border: "#E5E7EB",
      text: "#111827",
      textMuted: "#6B7280",
      btn: "#374151",
      btnText: "#ffffff",
      btnHover: "#1F2937",
    },
  },

  sunset_commerce: {
    id: "sunset_commerce",
    label: "Sunset Commerce",
    style: "promo / conversion",
    fonts: {
      display: "Chakra Petch",
      body: "Manrope",
      import:
        "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Manrope:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#FF6B6B",
      accent: "#FFD166",
      highlight: "#FF8FA3",
      background: "#151520",
      surface: "rgba(255,107,107,0.08)",
      card: "rgba(255,107,107,0.09)",
      border: "rgba(255,107,107,0.18)",
      text: "#F9FAFB",
      textMuted: "#9CA3AF",
      btn: "#FF6B6B",
      btnText: "#ffffff",
      btnHover: "#E05555",
    },
  },

  soft_brown: {
    id: "soft_brown",
    label: "Soft Brown",
    style: "cafe chic",
    fonts: {
      display: "Playfair Display",
      body: "Lato",
      import:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700&display=swap",
    },
    colors: {
      primary: "#92400E",
      accent: "#D97706",
      highlight: "#FDE68A",
      background: "#FFFAF5",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#F0D9BA",
      text: "#6B3A10",
      textMuted: "#9A6030",
      btn: "#92400E",
      btnText: "#ffffff",
      btnHover: "#78350F",
    },
  },

  peachy_store: {
    id: "peachy_store",
    label: "Peachy Store",
    style: "lifestyle",
    fonts: {
      display: "Outfit",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Outfit:wght@700;800&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#EA580C",
      accent: "#FB923C",
      highlight: "#FED7AA",
      background: "#FFF9F5",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#FDBA74",
      text: "#7C2D12",
      textMuted: "#C2410C",
      btn: "#EA580C",
      btnText: "#ffffff",
      btnHover: "#C2410C",
    },
  },

  lemon_clean: {
    id: "lemon_clean",
    label: "Lemon Clean",
    style: "produits menagers",
    fonts: {
      display: "Fredoka One",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#CA8A04",
      accent: "#EAB308",
      highlight: "#FEF08A",
      background: "#FEFCE8",
      surface: "rgba(255,255,255,0.90)",
      card: "#FFFFFF",
      border: "#FEF9C3",
      text: "#713F12",
      textMuted: "#A16207",
      btn: "#CA8A04",
      btnText: "#ffffff",
      btnHover: "#A16207",
    },
  },

  milk_soft: {
    id: "milk_soft",
    label: "Milk Soft",
    style: "minimal",
    fonts: {
      display: "Manrope",
      body: "Manrope",
      import:
        "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
    },
    colors: {
      primary: "#1F2937",
      accent: "#9CA3AF",
      highlight: "#F3F4F6",
      background: "#FAFAFA",
      surface: "#FFFFFF",
      card: "#FFFFFF",
      border: "#E5E7EB",
      text: "#111827",
      textMuted: "#6B7280",
      btn: "#1F2937",
      btnText: "#ffffff",
      btnHover: "#111827",
    },
  },

  sky_pastel: {
    id: "sky_pastel",
    label: "Sky Pastel",
    style: "kids / soft",
    fonts: {
      display: "Fredoka One",
      body: "Quicksand",
      import:
        "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@400;500;600;700&display=swap",
    },
    colors: {
      primary: "#3B82F6",
      accent: "#93C5FD",
      highlight: "#EFF6FF",
      background: "#F5F9FF",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#DBEAFE",
      text: "#1E3A8A",
      textMuted: "#3B82F6",
      btn: "#3B82F6",
      btnText: "#ffffff",
      btnHover: "#2563EB",
    },
  },

  grape_soda: {
    id: "grape_soda",
    label: "Grape Soda",
    style: "fun purple",
    fonts: {
      display: "Fredoka One",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#7E22CE",
      accent: "#A855F7",
      highlight: "#E9D5FF",
      background: "#F5F0FF",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#E9D5FF",
      text: "#4A1D96",
      textMuted: "#7E22CE",
      btn: "#7E22CE",
      btnText: "#ffffff",
      btnHover: "#6B21A8",
    },
  },

  strawberry_milk: {
    id: "strawberry_milk",
    label: "Strawberry Milk",
    style: "sweet pink",
    fonts: {
      display: "Pacifico",
      body: "Quicksand",
      import:
        "https://fonts.googleapis.com/css2?family=Pacifico&family=Quicksand:wght@400;500;600;700&display=swap",
    },
    colors: {
      primary: "#E11D48",
      accent: "#FB7185",
      highlight: "#FFF1F2",
      background: "#FFF5F7",
      surface: "rgba(255,255,255,0.90)",
      card: "#FFFFFF",
      border: "#FECDD3",
      text: "#881337",
      textMuted: "#BE123C",
      btn: "#E11D48",
      btnText: "#ffffff",
      btnHover: "#BE123C",
    },
  },

  pistachio_soft: {
    id: "pistachio_soft",
    label: "Pistachio",
    style: "food healthy",
    fonts: {
      display: "Josefin Sans",
      body: "Nunito",
      import:
        "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@600;700&family=Nunito:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#65A30D",
      accent: "#A3E635",
      highlight: "#ECFCCB",
      background: "#F8FFE8",
      surface: "rgba(255,255,255,0.88)",
      card: "#FFFFFF",
      border: "#D9F99D",
      text: "#365314",
      textMuted: "#4D7C0F",
      btn: "#65A30D",
      btnText: "#ffffff",
      btnHover: "#4D7C0F",
    },
  },

  cherry_cute: {
    id: "cherry_cute",
    label: "Cherry Cute",
    style: "snack",
    fonts: {
      display: "Pacifico",
      body: "Quicksand",
      import:
        "https://fonts.googleapis.com/css2?family=Pacifico&family=Quicksand:wght@400;500;600&display=swap",
    },
    colors: {
      primary: "#DC2626",
      accent: "#F87171",
      highlight: "#FEE2E2",
      background: "#FFF5F5",
      surface: "rgba(255,255,255,0.90)",
      card: "#FFFFFF",
      border: "#FECACA",
      text: "#7F1D1D",
      textMuted: "#B91C1C",
      btn: "#DC2626",
      btnText: "#ffffff",
      btnHover: "#B91C1C",
    },
  },

  soft_red_food: {
    id: "soft_red_food",
    label: "Soft Red Food",
    style: "fast food",
    fonts: {
      display: "Oswald",
      body: "Source Sans 3",
      import:
        "https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Source+Sans+3:wght@400;600&display=swap",
    },
    colors: {
      primary: "#EF4444",
      accent: "#FCA5A5",
      highlight: "#FEF2F2",
      background: "#FFF7F7",
      surface: "rgba(255,255,255,0.90)",
      card: "#FFFFFF",
      border: "#FECACA",
      text: "#7F1D1D",
      textMuted: "#B91C1C",
      btn: "#EF4444",
      btnText: "#ffffff",
      btnHover: "#DC2626",
    },
  },
};

export const DEFAULT_THEME = "pistachio_soft";
