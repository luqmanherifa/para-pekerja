const admin = require("firebase-admin");
require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

const ADMIN_UID = process.env.ADMIN_UID;

const TODAY = new Date().toLocaleDateString("en-CA", {
  timeZone: "Asia/Jakarta",
});

const FAKE_USERS = [
  { uid: "seed_u01", displayName: "Budi Santoso", jobTitle: "Karyawan Swasta" },
  { uid: "seed_u02", displayName: "Dewi Rahayu", jobTitle: "Freelancer" },
  { uid: "seed_u03", displayName: "Rizky Pratama", jobTitle: "Mahasiswa" },
  { uid: "seed_u04", displayName: "Sari Indah", jobTitle: "Content Creator" },
  {
    uid: "seed_u05",
    displayName: "Fajar Nugroho",
    jobTitle: "Software Engineer",
  },
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
    hrNote:
      "HR memahami. Terkadang hadir secara fisik sudah merupakan prestasi.",
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
      {
        label: "Potongan Rapat Dihadiri tapi Tidak Didengarkan",
        amount: -75000,
      },
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

const now = admin.firestore.FieldValue.serverTimestamp();

async function seedUsers() {
  console.log("Seeding fake users...");
  const batch = db.batch();
  FAKE_USERS.forEach((u) => {
    batch.set(db.collection("users").doc(u.uid), {
      displayName: u.displayName,
      jobTitle: u.jobTitle,
      email: `${u.uid}@seed.local`,
      role: "member",
      lastActiveAt: now,
      createdAt: now,
    });
  });
  await batch.commit();
  console.log("  ✓ fake users");
}

async function seedAttendance() {
  console.log("Seeding attendance...");
  const batch = db.batch();
  const moodStats = {};
  const featuredPayslips = [];

  FAKE_USERS.forEach((u, i) => {
    const mood = MOODS[i % MOODS.length];
    const payslip = buildPayslip(mood);
    const docId = `${u.uid}_${TODAY}`;

    batch.set(db.collection("attendance").doc(docId), {
      uid: u.uid,
      displayName: u.displayName,
      mood,
      payslip,
      date: TODAY,
      createdAt: now,
      voteCount: Math.floor(Math.random() * 8),
      voters: [],
    });

    moodStats[mood] = (moodStats[mood] ?? 0) + 1;

    if (featuredPayslips.length < 5) {
      featuredPayslips.push({
        id: docId,
        uid: u.uid,
        displayName: u.displayName,
        mood,
        hrNote: payslip.hrNote,
        total: payslip.total,
        voteCount: Math.floor(Math.random() * 8),
        voters: [],
      });
    }
  });

  batch.set(db.collection("daily_stats").doc(TODAY), {
    total: FAKE_USERS.length,
    moods: moodStats,
    date: TODAY,
  });

  batch.set(db.collection("daily_featured").doc(TODAY), {
    payslips: featuredPayslips,
    date: TODAY,
  });

  await batch.commit();
  console.log("  ✓ attendance, daily_stats, daily_featured");
}

async function seedJobs() {
  console.log("Seeding jobs...");
  const jobs = [
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

  const batch = db.batch();
  jobs.forEach((job, i) => {
    const ref = db.collection("jobs").doc();
    batch.set(ref, {
      ...job,
      submittedBy: FAKE_USERS[i].displayName,
      uid: FAKE_USERS[i].uid,
      approved: Math.floor(Math.random() * 30) + 5,
      rejected: Math.floor(Math.random() * 15),
      voters_approved: [],
      voters_rejected: [],
      createdAt: now,
    });
  });

  await batch.commit();
  console.log("  ✓ jobs");
}

async function seedQuotes() {
  console.log("Seeding quotes...");
  const quotes = [
    {
      episodeId: "ep1",
      speaker: HOSTS[0],
      text: "Kalau kamu nggak capek, berarti kamu belum kerja keras. Kalau kamu capek, berarti kamu butuh istirahat. Intinya istirahat dulu.",
    },
    {
      episodeId: "ep1",
      speaker: HOSTS[1],
      text: "Gue pernah kerja sampai lupa makan siang. Terus inget jam 3. Itu bukan dedikasi, itu lupa.",
    },
    {
      episodeId: "ep2",
      speaker: HOSTS[2],
      text: "Meeting tiga jam membahas warna tombol. Akhirnya pilih warna pertama yang diusulkan di awal meeting.",
    },
    {
      episodeId: "ep2",
      speaker: GUESTS[0],
      text: "Produktif itu bukan soal sibuk, tapi soal selesai. Kalau sibuk tapi nggak selesai-selesai, itu namanya hobi.",
    },
    {
      episodeId: "ep3",
      speaker: HOSTS[0],
      text: "Email paling penting selalu datang jam 4:58 sore hari Jumat. Selalu.",
    },
    {
      episodeId: "ep3",
      speaker: GUESTS[1],
      text: "Satu-satunya deadline yang selalu tepat waktu adalah deadline gajian. Sisanya negosiasi.",
    },
    {
      episodeId: "ep4",
      speaker: HOSTS[1],
      text: "WFH itu artinya Working From Home, bukan Waiting For Homework. Tapi yang terjadi sering yang kedua.",
    },
    {
      episodeId: "ep4",
      speaker: GUESTS[2],
      text: "Presentasi yang bagus itu bukan yang banyak slidenya. Yang bagus itu yang cepat selesainya.",
    },
    {
      episodeId: "ep5",
      speaker: HOSTS[2],
      text: "Kalau ada yang bilang 'ini mudah kok', berarti mereka belum pernah coba sendiri.",
    },
    {
      episodeId: "ep5",
      speaker: HOSTS[0],
      text: "Revisi pertama itu wajar. Revisi keempat belas itu pertanda kamu perlu ngobrol langsung.",
    },
  ];

  const batch = db.batch();
  quotes.forEach((q, i) => {
    const ref = db.collection("quotes").doc();
    batch.set(ref, {
      episodeId: q.episodeId,
      episodeLabel: EPISODE_LABELS[q.episodeId],
      speakerId: q.speaker.id,
      speakerName: q.speaker.name,
      speakerType: q.speaker.type,
      text: q.text,
      uid: FAKE_USERS[i].uid,
      submittedBy: FAKE_USERS[i].displayName,
      voteCount: Math.floor(Math.random() * 20) + 1,
      voters: [],
      createdAt: now,
    });
  });

  await batch.commit();
  console.log("  ✓ quotes");
}

async function seedBattles() {
  console.log("Seeding battles...");
  const battles = [
    {
      episodeId: "ep1",
      speakerA: HOSTS[0],
      summaryA:
        "Arif berpendapat bahwa kerja keras tanpa arah justru membuang energi. Lebih baik kerja sedikit tapi tepat sasaran daripada sibuk seharian tanpa hasil jelas.",
      speakerB: HOSTS[1],
      summaryB:
        "Bintang berargumen bahwa konsistensi adalah kunci. Meski arah belum sempurna, bergerak setiap hari lebih baik daripada diam menunggu strategi yang sempurna.",
    },
    {
      episodeId: "ep1",
      speakerA: HOSTS[1],
      summaryA:
        "Bintang percaya bahwa work-life balance itu mitos. Yang ada hanya pilihan prioritas di setiap momen, dan orang harus jujur soal apa yang benar-benar penting.",
      speakerB: HOSTS[2],
      summaryB:
        "Gilang membela konsep balance dengan argumen bahwa tanpa istirahat cukup, output kerja jangka panjang justru menurun. Burnout bukan tanda dedikasi.",
    },
    {
      episodeId: "ep2",
      speakerA: HOSTS[0],
      summaryA:
        "Arif berpendapat meeting seharusnya dihapus total dan diganti dokumen async. Semua orang bisa baca kapan saja tanpa harus sinkronisasi waktu.",
      speakerB: GUESTS[0],
      summaryB:
        "Adi berargumen bahwa meeting langsung tetap diperlukan untuk keputusan penting. Komunikasi nonverbal dan dinamika diskusi real-time tidak bisa digantikan dokumen.",
    },
    {
      episodeId: "ep2",
      speakerA: HOSTS[2],
      summaryA:
        "Gilang percaya bahwa bekerja dari kafe lebih produktif karena suasana berbeda memicu kreativitas dan mengurangi distraksi rumah.",
      speakerB: HOSTS[1],
      summaryB:
        "Bintang tidak setuju, menurutnya produktivitas bergantung pada sistem dan kebiasaan, bukan lokasi. Kafe hanya ilusi perubahan yang sementara.",
    },
    {
      episodeId: "ep3",
      speakerA: GUESTS[1],
      summaryA:
        "Pandji berpendapat gaji besar di pekerjaan yang tidak disukai lebih baik daripada gaji kecil di passion. Finansial yang aman membuka lebih banyak pilihan hidup.",
      speakerB: HOSTS[0],
      summaryB:
        "Arif berargumen bahwa mengerjakan sesuatu yang tidak kamu sukai dalam jangka panjang menguras energi mental dan berakhir lebih mahal dari sisi kesehatan.",
    },
    {
      episodeId: "ep3",
      speakerA: HOSTS[1],
      summaryA:
        "Bintang percaya feedback negatif dari atasan harus diterima dengan lapang dada karena itu bagian dari pertumbuhan profesional.",
      speakerB: HOSTS[2],
      summaryB:
        "Gilang membedakan antara feedback konstruktif dan kritik tidak produktif. Tidak semua masukan layak diterima, dan kemampuan menyaring itu penting.",
    },
    {
      episodeId: "ep4",
      speakerA: GUESTS[2],
      summaryA:
        "Raditya berpendapat bahwa membangun personal branding di media sosial adalah keharusan di era ini, terutama untuk karier kreatif.",
      speakerB: HOSTS[2],
      summaryB:
        "Gilang skeptis dengan personal branding berlebihan. Kualitas kerja yang konsisten lebih sustainable daripada pencitraan online.",
    },
    {
      episodeId: "ep4",
      speakerA: HOSTS[0],
      summaryA:
        "Arif berpendapat multitasking adalah kebohongan produktivitas. Otak manusia tidak bisa benar-benar melakukan dua hal penting secara bersamaan.",
      speakerB: GUESTS[0],
      summaryB:
        "Adi berargumen bahwa multitasking untuk tugas rutin dan otomatis sangat mungkin dan efisien. Yang tidak bisa adalah dua tugas kognitif berat sekaligus.",
    },
    {
      episodeId: "ep5",
      speakerA: HOSTS[1],
      summaryA:
        "Bintang percaya resign tanpa backup pekerjaan baru adalah keputusan berani yang kadang diperlukan untuk keluar dari lingkungan kerja toxic.",
      speakerB: GUESTS[1],
      summaryB:
        "Pandji lebih konservatif, berargumen bahwa negosiasi dan komunikasi internal harus dieksplor habis sebelum memutuskan keluar, terutama soal stabilitas finansial.",
    },
    {
      episodeId: "ep5",
      speakerA: HOSTS[2],
      summaryA:
        "Gilang berpendapat gelar akademik masih sangat relevan dan membuka pintu yang tidak bisa dibuka jalur lain untuk profesi tertentu.",
      speakerB: GUESTS[2],
      summaryB:
        "Raditya lebih percaya pada portofolio dan track record nyata. Di industri kreatif, apa yang sudah kamu buat jauh lebih berbicara daripada ijazah.",
    },
  ];

  const batch = db.batch();
  battles.forEach((b, i) => {
    const ref = db.collection("battles").doc();
    const voteCountA = Math.floor(Math.random() * 25) + 3;
    const voteCountB = Math.floor(Math.random() * 25) + 3;
    batch.set(ref, {
      episodeId: b.episodeId,
      episodeLabel: EPISODE_LABELS[b.episodeId],
      speakerAId: b.speakerA.id,
      speakerAName: b.speakerA.name,
      speakerAType: b.speakerA.type,
      summaryA: b.summaryA,
      speakerBId: b.speakerB.id,
      speakerBName: b.speakerB.name,
      speakerBType: b.speakerB.type,
      summaryB: b.summaryB,
      uid: FAKE_USERS[i].uid,
      submittedBy: FAKE_USERS[i].displayName,
      voteCountA,
      voteCountB,
      totalVotes: voteCountA + voteCountB,
      votersA: [],
      votersB: [],
      createdAt: now,
    });
  });

  await batch.commit();
  console.log("  ✓ battles");
}

async function seedGuestRankings() {
  console.log("Seeding guest rankings...");
  const batch = db.batch();
  GUESTS.forEach((g) => {
    batch.set(db.collection("guest_rankings").doc(g.id), {
      guestId: g.id,
      voteCount: Math.floor(Math.random() * 40) + 5,
      voters: [],
      createdAt: now,
    });
  });
  await batch.commit();
  console.log("  ✓ guest_rankings");
}

async function main() {
  if (ADMIN_UID === "GANTI_DENGAN_UID_KAMU") {
    console.error(
      "⚠  Ganti nilai ADMIN_UID di baris atas seeder.js dengan UID akun kamu.",
    );
    process.exit(1);
  }

  console.log("\nPara Pekerja — Seeder");
  console.log(`Tanggal : ${TODAY}`);
  console.log("─────────────────────\n");

  try {
    await seedUsers();
    await seedAttendance();
    await seedJobs();
    await seedQuotes();
    await seedBattles();
    await seedGuestRankings();

    console.log("\n─────────────────────");
    console.log("✓ Semua data berhasil diisi.");
    console.log("  Jalankan seeder hanya sekali untuk menghindari duplikasi.");
  } catch (err) {
    console.error("\n✗ Seeder gagal:", err);
    process.exit(1);
  }

  process.exit(0);
}

main();
