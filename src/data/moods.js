export const MOODS = [
  {
    id: "productive",
    label: "Produktif Total",
    icon: "Zap",
    pill: "bg-green-50 text-green-700 border-green-200 hover:border-green-400",
    active: "bg-green-600 text-white border-green-600",
    bar: "bg-green-500",
    badge: "bg-green-100 text-green-700",
  },
  {
    id: "chill",
    label: "Santai tapi Jalan",
    icon: "Coffee",
    pill: "bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-400",
    active: "bg-sky-500 text-white border-sky-500",
    bar: "bg-sky-400",
    badge: "bg-sky-100 text-sky-700",
  },
  {
    id: "low_energy",
    label: "Low Energy",
    icon: "BatteryLow",
    pill: "bg-indigo-50 text-indigo-600 border-indigo-200 hover:border-indigo-400",
    active: "bg-indigo-500 text-white border-indigo-500",
    bar: "bg-indigo-400",
    badge: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "focus",
    label: "Fokus, Jangan Ganggu",
    icon: "Target",
    pill: "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400",
    active: "bg-amber-500 text-white border-amber-500",
    bar: "bg-amber-400",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    id: "watching",
    label: "Kerja Sambil Nonton",
    icon: "Tv2",
    pill: "bg-violet-50 text-violet-700 border-violet-200 hover:border-violet-400",
    active: "bg-violet-500 text-white border-violet-500",
    bar: "bg-violet-400",
    badge: "bg-violet-100 text-violet-700",
  },
  {
    id: "freelance",
    label: "Freelancer Mode",
    icon: "Umbrella",
    pill: "bg-orange-50 text-orange-700 border-orange-200 hover:border-orange-400",
    active: "bg-orange-500 text-white border-orange-500",
    bar: "bg-orange-400",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    id: "survival",
    label: "Survival Mode",
    icon: "AlertTriangle",
    pill: "bg-red-50 text-red-700 border-red-200 hover:border-red-400",
    active: "bg-red-500 text-white border-red-500",
    bar: "bg-red-400",
    badge: "bg-red-100 text-red-700",
  },
  {
    id: "autopilot",
    label: "Autopilot Mode",
    icon: "Ghost",
    pill: "bg-teal-50 text-teal-600 border-teal-200 hover:border-teal-400",
    active: "bg-teal-500 text-white border-teal-500",
    bar: "bg-teal-400",
    badge: "bg-teal-100 text-teal-600",
  },
];

const PAYSLIP_DATA = {
  productive: {
    items: [
      { label: "Bonus Semangat Pagi", amount: 250000 },
      { label: "Insentif Kamera Menyala saat Meeting", amount: 175000 },
      { label: "Potongan Overthinking Deadline", amount: -75000 },
    ],
    hrNote:
      "Kinerja hari ini patut diapresiasi. Pertahankan — meski kita semua tahu besok mungkin berbeda.",
  },
  chill: {
    items: [
      { label: "Bonus Tidak Panik", amount: 200000 },
      { label: "Insentif Mengalir Apa Adanya", amount: 100000 },
      { label: "Potongan Terlalu Santai di Jam Sibuk", amount: -50000 },
    ],
    hrNote:
      "Santai memang pilihan hidup. HR mencatat kehadiran, bukan kegelisahan kamu.",
  },
  low_energy: {
    items: [
      { label: "Tunjangan Tetap Masuk Kerja", amount: 100000 },
      { label: "Apresiasi Buka Laptop Walau Berat", amount: 75000 },
      { label: "Potongan Semangat Tertinggal di Kasur", amount: -150000 },
      { label: "Potongan Sering Lihat Jam", amount: -50000 },
    ],
    hrNote:
      "HR memahami. Terkadang hadir secara fisik sudah merupakan prestasi tersendiri.",
  },
  focus: {
    items: [
      { label: "Bonus Mode Tidak Terganggu", amount: 300000 },
      { label: "Insentif Notifikasi Dibisukan", amount: 125000 },
      { label: "Potongan Lupa Makan Siang", amount: -25000 },
    ],
    hrNote:
      "HR menghormati ketenangan kamu hari ini. Pintu HR juga dikunci untuk kamu.",
  },
  watching: {
    items: [
      { label: "Bonus Multitasking Profesional", amount: 200000 },
      { label: "Insentif Tidak Tertangkap Basah", amount: 150000 },
      { label: "Potongan Produktivitas Terbagi", amount: -200000 },
      { label: "Potongan Rewind 3 Menit karena Tidak Fokus", amount: -75000 },
    ],
    hrNote:
      "HR tidak bertanya. HR juga sedang menonton sesuatu saat menulis catatan ini.",
  },
  freelance: {
    items: [
      { label: "Bonus Kebebasan Waktu", amount: 350000 },
      { label: "Insentif Tidak Ada yang Mengawasi", amount: 200000 },
      { label: "Potongan Batas Waktu Ambigu", amount: -100000 },
      { label: "Potongan Tidak Ada BPJS", amount: -125000 },
    ],
    hrNote:
      "Kebebasan adalah gaji yang tidak tertulis. Tapi ini tetap slip bergaji 5 juta.",
  },
  survival: {
    items: [
      { label: "Tunjangan Bertahan Hidup", amount: 100000 },
      { label: "Bonus Belum Resign", amount: 250000 },
      { label: "Potongan Kekacauan Hari Ini", amount: -200000 },
      { label: "Potongan Energi Habis sejak Senin", amount: -150000 },
    ],
    hrNote:
      "HR melihat kondisi kamu. HR ikut berdoa. Semoga hari ini segera selesai.",
  },
  autopilot: {
    items: [
      { label: "Bonus Tubuh Hadir, Pikiran Entah di Mana", amount: 200000 },
      { label: "Insentif Menjawab Chat Tanpa Membaca", amount: 100000 },
      { label: "Potongan Tidak Ingat Apa yang Dikerjakan", amount: -125000 },
      {
        label: "Potongan Rapat Dihadiri tapi Tidak Didengarkan",
        amount: -75000,
      },
    ],
    hrNote:
      "HR tidak tahu kamu hadir atau tidak. Kamu juga tidak tahu. Sama-sama.",
  },
};

export const AMBIENT_TEXT = {
  productive: "Kantor hari ini sedang bersemangat.",
  chill: "Suasana santai tapi tetap jalan hari ini.",
  low_energy: "Kantor hari ini sedang tidak baik-baik saja.",
  focus: "Bisukan notifikasi. Kantor sedang serius.",
  watching: "Separuh kantor sedang menonton sesuatu.",
  freelance: "Hari ini mayoritas kerja dari mana saja.",
  survival: "Mode darurat. Bertahanlah.",
  autopilot: "Hari ini kantor berjalan sendiri. Entah siapa yang mengemudikan.",
  default: "Absen dulu sebelum pura-pura kerja.",
};

export const GHOST_ATTENDEES = [
  { id: "g1", displayName: "Arif Brata", mood: "productive" },
  { id: "g2", displayName: "Bintang Emon", mood: "chill" },
  { id: "g3", displayName: "Gilang Bhaskara", mood: "focus" },
  { id: "g4", displayName: "Adi Arkiang", mood: "watching" },
  { id: "g5", displayName: "Pandji Pragiwaksono", mood: "freelance" },
  { id: "g6", displayName: "Raditya Dika", mood: "survival" },
];

export const getMoodById = (id) => MOODS.find((m) => m.id === id) ?? MOODS[0];

export const formatRupiah = (n) => `Rp ${(n ?? 0).toLocaleString("id-ID")}`;

export const buildPayslip = (moodId) => {
  const base = 5000000;
  const data = PAYSLIP_DATA[moodId] ?? PAYSLIP_DATA.productive;
  const total = base + data.items.reduce((sum, item) => sum + item.amount, 0);
  return { base, items: data.items, total, hrNote: data.hrNote };
};
