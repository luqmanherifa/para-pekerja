export const HOSTS = [
  { id: "arif", name: "Arif Brata", type: "host" },
  { id: "bintang", name: "Bintang Emon", type: "host" },
  { id: "gilang", name: "Gilang Bhaskara", type: "host" },
];

export const GUESTS = [
  {
    id: "adi",
    name: "Adi Arkiang",
    type: "guest",
    episodes: ["Episode 1", "Episode 3"],
  },
  {
    id: "pandji",
    name: "Pandji Pragiwaksono",
    type: "guest",
    episodes: ["Episode 2"],
  },
  {
    id: "raditya",
    name: "Raditya Dika",
    type: "guest",
    episodes: ["Episode 4", "Episode 5"],
  },
];

export const ALL_SPEAKERS = [...HOSTS, ...GUESTS];

export const SPEAKER_COLORS = {
  arif: {
    bg: "bg-green-600",
    light: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    vote: "bg-green-600 hover:bg-green-700",
    voteLight: "bg-green-50 border-green-300 text-green-700",
    bar: "bg-green-500",
    rank: "text-green-500",
    accent: "bg-green-600",
  },
  bintang: {
    bg: "bg-sky-500",
    light: "bg-sky-50 text-sky-700 border-sky-200",
    dot: "bg-sky-500",
    vote: "bg-sky-500 hover:bg-sky-600",
    voteLight: "bg-sky-50 border-sky-300 text-sky-700",
    bar: "bg-sky-500",
    rank: "text-sky-500",
    accent: "bg-sky-500",
  },
  gilang: {
    bg: "bg-amber-500",
    light: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    vote: "bg-amber-500 hover:bg-amber-600",
    voteLight: "bg-amber-50 border-amber-300 text-amber-700",
    bar: "bg-amber-500",
    rank: "text-amber-500",
    accent: "bg-amber-500",
  },
  adi: {
    bg: "bg-violet-500",
    light: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
    vote: "bg-violet-500 hover:bg-violet-600",
    voteLight: "bg-violet-50 border-violet-300 text-violet-700",
    bar: "bg-violet-400",
    rank: "text-violet-500",
    accent: "bg-violet-500",
  },
  pandji: {
    bg: "bg-orange-500",
    light: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    vote: "bg-orange-500 hover:bg-orange-600",
    voteLight: "bg-orange-50 border-orange-300 text-orange-700",
    bar: "bg-orange-400",
    rank: "text-orange-500",
    accent: "bg-orange-500",
  },
  raditya: {
    bg: "bg-rose-500",
    light: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    vote: "bg-rose-500 hover:bg-rose-600",
    voteLight: "bg-rose-50 border-rose-300 text-rose-700",
    bar: "bg-rose-400",
    rank: "text-rose-500",
    accent: "bg-rose-500",
  },
};

const FALLBACK_COLOR = {
  bg: "bg-gray-500",
  light: "bg-gray-50 text-gray-700 border-gray-200",
  dot: "bg-gray-400",
  vote: "bg-gray-500 hover:bg-gray-600",
  voteLight: "bg-gray-50 border-gray-300 text-gray-700",
  bar: "bg-gray-400",
  rank: "text-gray-400",
  accent: "bg-gray-500",
};

export const getSpeakerById = (id) => ALL_SPEAKERS.find((s) => s.id === id);
export const getSpeakerColor = (id) => SPEAKER_COLORS[id] ?? FALLBACK_COLOR;
