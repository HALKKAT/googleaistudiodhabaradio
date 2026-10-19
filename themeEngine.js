/**
 * Intelligent Theme Inference Engine.
 * Infers aesthetic, colors, microcopy, badge status, and font personalities
 * entirely from the playlist title.
 */
export function inferTheme(playlistName = "") {
  const name = playlistName.toLowerCase();

  // Highway / Dhaba / Desi Truck / Roadside
  if (name.includes("dhaba") || name.includes("highway") || name.includes("truck") || name.includes("safar") || name.includes("punjabi")) {
    return {
      id: "dhaba",
      tagline: "Kadak Chai, High-Beams aur 80 KMPH ke Bass Drops 🚚💨",
      badge: "GT ROAD LIVE",
      badgeColor: "#ff4d00",
      colors: {
        bg: "#0d0906",
        cardBg: "#1c120c",
        primary: "#ff8c00",
        accent: "#ffe600",
        neon: "#00ffcc",
        text: "#fff8f0",
        muted: "#a38271",
        border: "#ff8c0044"
      },
      fontTitle: "'Rozha One', 'Yatra One', serif",
      fontBody: "'Space Grotesk', sans-serif",
      statusMessages: [
        "Chai garam hai, volume tez rakho! ☕",
        "Horn OK Please! Gaana rukna nahi chahiye 🎺",
        "GT Road special: Bas ek aur track...",
        "Full headlight mode on. Speed 90+ 🛣️",
        "Truck ke piche likha tha: Buri nazar wale, volume badha le!",
        "Dhaba certified bangers only 🛞"
      ],
      marqueeItems: [
        "HORN OK PLEASE",
        "HIGHWAY DHABA SPECIAL",
        "NON-STOP DILJIT & 90s ROAD HITS",
        "MAKHAN MAAR KE",
        "KADAK CHAI VIBES"
      ],
      visualType: "dhaba-cassette",
      shareConfirm: "Dhaba ka adda share ho gaya boss! 🚚"
    };
  }

  // Worksite / Dihadi / Labor / Hard Work
  if (name.includes("dihadi") || name.includes("majdoor") || name.includes("kaam") || name.includes("shift") || name.includes("labor")) {
    return {
      id: "dihadi",
      tagline: "Daily Wage. Lifetime Bangers. 🔨",
      badge: "ON DUTY",
      badgeColor: "#facc15",
      colors: {
        bg: "#111215",
        cardBg: "#1c1e24",
        primary: "#eab308",
        accent: "#f97316",
        neon: "#38bdf8",
        text: "#f8fafc",
        muted: "#94a3b8",
        border: "#eab30844"
      },
      fontTitle: "'Chakra Petch', sans-serif",
      fontBody: "'Space Grotesk', sans-serif",
      statusMessages: [
        "Kaam chalu hai, shor mat karo 🔨",
        "Shift khatam, playlist nahi.",
        "Full volume pe kaam tez hota hai.",
        "Overtime mood activated ⚡",
        "Speaker phatna nahi chahiye, bas haath chalte rahein!"
      ],
      marqueeItems: [
        "OVERTIME BANGERS",
        "NO EXCUSES",
        "HARD WORK ONLY",
        "SHIFT MODE 100%"
      ],
      visualType: "rugged-speaker",
      shareConfirm: "Shift link bhej diya! 🔨"
    };
  }

  // Default / Versatile Retro Music Machine
  return {
    id: "retro",
    tagline: "Pure sonic vibes, uncut and uninterrupted ⚡",
    badge: "NOW BROADCASTING",
    badgeColor: "#ec4899",
    colors: {
      bg: "#0a0a0f",
      cardBg: "#141420",
      primary: "#ec4899",
      accent: "#8b5cf6",
      neon: "#06b6d4",
      text: "#f9fafb",
      muted: "#9ca3af",
      border: "#ec489933"
    },
    fontTitle: "'Chakra Petch', sans-serif",
    fontBody: "'Space Grotesk', sans-serif",
    statusMessages: [
      "Certified sonic gold 📻",
      "Volume thoda aur badha lo...",
      "Unmatched frequency right now.",
      "Earphones mandatory for optimum bass.",
      "Next track incoming 🎵"
    ],
    marqueeItems: [
      "HEAVY ROTATION",
      "ALL KILLER NO FILLER",
      "MAXIMUM GAIN",
      "ANALOG WARMTH"
    ],
    visualType: "vinyl",
    shareConfirm: "Playlist link copied to clipboard! 🎧"
  };
}

export function updateDocumentSEO(config, theme) {
  document.title = `${config.playlistName} | ${theme.badge}`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", theme.tagline);
  
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", config.playlistName);
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute("content", theme.tagline);
}