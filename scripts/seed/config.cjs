const admin = require("firebase-admin");
require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();
const now = admin.firestore.FieldValue.serverTimestamp();

const ADMIN_UID = process.env.ADMIN_UID ?? "GANTI_DENGAN_UID_KAMU";

if (ADMIN_UID === "GANTI_DENGAN_UID_KAMU") {
  console.error("⚠  Ganti nilai ADMIN_UID di file .env dengan UID akun kamu.");
  process.exit(1);
}

const TODAY = new Date().toLocaleDateString("en-CA", {
  timeZone: "Asia/Jakarta",
});

const FAKE_USERS = [
  { uid: "seed_u01", displayName: "Budi Santoso", jobTitle: "Karyawan Swasta" },
  { uid: "seed_u02", displayName: "Dewi Rahayu", jobTitle: "Freelancer" },
  { uid: "seed_u03", displayName: "Rizky Pratama", jobTitle: "Mahasiswa" },
  { uid: "seed_u04", displayName: "Sari Indah", jobTitle: "Content Creator" },
  { uid: "seed_u05", displayName: "Fajar Nugroho", jobTitle: "Software Engineer" },
  { uid: "seed_u06", displayName: "Nisa Aulia", jobTitle: "Desainer Grafis" },
  { uid: "seed_u07", displayName: "Hendra Wijaya", jobTitle: "Marketing" },
  { uid: "seed_u08", displayName: "Putri Lestari", jobTitle: "Guru" },
  { uid: "seed_u09", displayName: "Agus Setiawan", jobTitle: "Wirausaha" },
  { uid: "seed_u10", displayName: "Rina Kusuma", jobTitle: "HRD" },
];

const MOODS = [
  "productive",
  "chill",
  "low_energy",
  "focus",
  "watching",
  "freelance",
  "survival",
  "autopilot",
];

const PAYSLIP_DATA = {
  productive: {
    items: [
      { label: "Bonus Semangat Pagi", amount: 250000 },
      { label: "Insentif Kamera Menyala saat Meeting", amount: 175000 },
      { label: "Potongan Overthinking Deadline", amount: -75000 },
    ],
    hrNote: "Kinerja hari ini patut diapresiasi. Pertahankan.",
  },
  chill: {
    items: [
      { label: "Bonus Tidak Panik", amount: 200000 },
      { label: "Insentif Mengalir Apa Adanya", amount: 100000 },
      { label: "Potongan Terlalu Santai di Jam Sibuk", amount: -50000 },
    ],
    hrNote: "Santai memang pilihan hidup.",
  },
  low_energy: {
    items: [
      { label: "Tunjangan Tetap Masuk Kerja", amount: 100000 },
      { label: "Apresiasi Buka Laptop Walau Berat", amount: 75000 },
      { label: "Potongan Semangat Tertinggal di Kasur", amount: -150000 },
      { label: "Potongan Sering Lihat Jam", amount: -50000 },
    ],
    hrNote: "HR memahami. Terkadang hadir secara fisik sudah merupakan prestasi.",
  },
  focus: {
    items: [
      { label: "Bonus Mode Tidak Terganggu", amount: 300000 },
      { label: "Insentif Notifikasi Dibisukan", amount: 125000 },
      { label: "Potongan Lupa Makan Siang", amount: -25000 },
    ],
    hrNote: "HR menghormati ketenangan kamu hari ini.",
  },
  watching: {
    items: [
      { label: "Bonus Multitasking Profesional", amount: 200000 },
      { label: "Insentif Tidak Tertangkap Basah", amount: 150000 },
      { label: "Potongan Produktivitas Terbagi", amount: -200000 },
      { label: "Potongan Rewind 3 Menit", amount: -75000 },
    ],
    hrNote: "HR tidak bertanya.",
  },
  freelance: {
    items: [
      { label: "Bonus Kebebasan Waktu", amount: 350000 },
      { label: "Insentif Tidak Ada yang Mengawasi", amount: 200000 },
      { label: "Potongan Batas Waktu Ambigu", amount: -100000 },
      { label: "Potongan Tidak Ada BPJS", amount: -125000 },
    ],
    hrNote: "Kebebasan adalah gaji yang tidak tertulis.",
  },
  survival: {
    items: [
      { label: "Tunjangan Bertahan Hidup", amount: 100000 },
      { label: "Bonus Belum Resign", amount: 250000 },
      { label: "Potongan Kekacauan Hari Ini", amount: -200000 },
      { label: "Potongan Energi Habis sejak Senin", amount: -150000 },
    ],
    hrNote: "HR ikut berdoa. Semoga hari ini segera selesai.",
  },
  autopilot: {
    items: [
      { label: "Bonus Tubuh Hadir, Pikiran Entah di Mana", amount: 200000 },
      { label: "Insentif Menjawab Chat Tanpa Membaca", amount: 100000 },
      { label: "Potongan Tidak Ingat Apa yang Dikerjakan", amount: -125000 },
      { label: "Potongan Rapat Dihadiri tapi Tidak Didengarkan", amount: -75000 },
    ],
    hrNote: "HR tidak tahu kamu hadir atau tidak. Sama-sama.",
  },
};

const buildPayslip = (moodId) => {
  const base = 5000000;
  const data = PAYSLIP_DATA[moodId];
  const total = base + data.items.reduce((sum, item) => sum + item.amount, 0);
  return { base, items: data.items, total, hrNote: data.hrNote };
};

const EPISODE_LABELS = {
  ep1: "Episode 1",
  ep2: "Episode 2",
  ep3: "Episode 3",
  ep4: "Episode 4",
  ep5: "Episode 5",
};

const HOSTS = [
  { id: "arif", name: "Arif Brata", type: "host" },
  { id: "bintang", name: "Bintang Emon", type: "host" },
  { id: "gilang", name: "Gilang Bhaskara", type: "host" },
];

const GUESTS = [
  { id: "adi", name: "Adi Arkiang", type: "guest" },
  { id: "pandji", name: "Pandji Pragiwaksono", type: "guest" },
  { id: "raditya", name: "Raditya Dika", type: "guest" },
];

module.exports = {
  db,
  now,
  TODAY,
  ADMIN_UID,
  FAKE_USERS,
  MOODS,
  buildPayslip,
  EPISODE_LABELS,
  HOSTS,
  GUESTS,
};
