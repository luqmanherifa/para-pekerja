const { db, now, FAKE_USERS } = require("./config.cjs");

const JOBS = [
  {
    title: "Penjinak Kucing Kantor",
    description:
      "Bertugas memastikan semua kucing liar di area kantor tidak mengganggu rapat penting. Termasuk negosiasi dengan kucing yang duduk di keyboard laptop bos.",
  },
  {
    title: "Penjaga Kulkas Bersama",
    description:
      "Memantau isi kulkas kantor setiap jam, memastikan tidak ada makanan yang dicuri, dan menginvestigasi misteri bekal yang hilang setiap Selasa.",
  },
  {
    title: "Koordinator Tidur Siang",
    description:
      "Mengatur jadwal tidur siang karyawan agar tidak terlalu ramai di mushola. Menyediakan bantal dan alarm sesuai durasi yang disepakati.",
  },
  {
    title: "Juru Bicara Meeting Zoom",
    description:
      "Bertugas bilang 'kamu mute' ke orang yang berbicara tapi tidak terdengar. Minimal 40 kali per hari kerja.",
  },
  {
    title: "Pengelola Grup WhatsApp Kantor",
    description:
      "Memastikan tidak ada yang kirim stiker terlalu banyak, mengingatkan anggota untuk baca pesan sebelum bertanya, dan menghapus pesan typo sebelum dibaca bos.",
  },
  {
    title: "Ahli Komentar Dashboard",
    description:
      "Bertugas mengomentari setiap grafik di dashboard dengan ekspresi kagum meskipun angkanya sama seperti bulan lalu.",
  },
  {
    title: "Pengingat Deadline Manusia",
    description:
      "Mengingatkan rekan kerja tentang deadline menggunakan berbagai media: chat, telepon, sticky note, dan tatapan penuh makna di lorong kantor.",
  },
  {
    title: "Penyambut Tamu Antusias",
    description:
      "Menyambut setiap tamu dengan energi yang sama meskipun tamu kelima di hari yang sama. Senyum tidak boleh kurang dari 80 derajat.",
  },
  {
    title: "Peneliti Meme Kerja",
    description:
      "Mengumpulkan dan mengkurasi meme tentang pekerjaan yang relevan untuk dikirim ke grup kantor setiap pagi, meningkatkan semangat kerja sebesar 0.5%.",
  },
  {
    title: "Spesialis Kirim Email Selamat Pagi",
    description:
      "Mengirim email sapaan pagi ke seluruh divisi setiap Senin. Isi harus berbeda tiap minggu dan tidak boleh ada yang menyadari kalau tidak ada informasi penting di dalamnya.",
  },
];

async function seedJobs() {
  console.log("Seeding jobs...");
  const batch = db.batch();
  JOBS.forEach((job, i) => {
    const ref = db.collection("jobs").doc();
    batch.set(ref, {
      ...job,
      submittedBy: FAKE_USERS[i].displayName,
      uid: FAKE_USERS[i].uid,
      approved: Math.floor(Math.random() * 30) + 5,
      voters_approved: [],
      createdAt: now,
    });
  });
  await batch.commit();
  console.log("  ✓ jobs");
}

module.exports = seedJobs;
