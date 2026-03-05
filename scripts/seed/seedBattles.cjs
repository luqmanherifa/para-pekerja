const { db, now, FAKE_USERS, HOSTS, GUESTS, EPISODE_LABELS } = require("./config.cjs");

const BATTLES = [
  {
    episodeId: "ep1",
    speakerA: HOSTS[0],
    summaryA: "Arif berpendapat bahwa kerja keras tanpa arah justru membuang energi. Lebih baik kerja sedikit tapi tepat sasaran daripada sibuk seharian tanpa hasil jelas.",
    speakerB: HOSTS[1],
    summaryB: "Bintang berargumen bahwa konsistensi adalah kunci. Meski arah belum sempurna, bergerak setiap hari lebih baik daripada diam menunggu strategi yang sempurna.",
  },
  {
    episodeId: "ep1",
    speakerA: HOSTS[1],
    summaryA: "Bintang percaya bahwa work-life balance itu mitos. Yang ada hanya pilihan prioritas di setiap momen, dan orang harus jujur soal apa yang benar-benar penting.",
    speakerB: HOSTS[2],
    summaryB: "Gilang membela konsep balance dengan argumen bahwa tanpa istirahat cukup, output kerja jangka panjang justru menurun. Burnout bukan tanda dedikasi.",
  },
  {
    episodeId: "ep2",
    speakerA: HOSTS[0],
    summaryA: "Arif berpendapat meeting seharusnya dihapus total dan diganti dokumen async. Semua orang bisa baca kapan saja tanpa harus sinkronisasi waktu.",
    speakerB: GUESTS[0],
    summaryB: "Adi berargumen bahwa meeting langsung tetap diperlukan untuk keputusan penting. Komunikasi nonverbal dan dinamika diskusi real-time tidak bisa digantikan dokumen.",
  },
  {
    episodeId: "ep2",
    speakerA: HOSTS[2],
    summaryA: "Gilang percaya bahwa bekerja dari kafe lebih produktif karena suasana berbeda memicu kreativitas dan mengurangi distraksi rumah.",
    speakerB: HOSTS[1],
    summaryB: "Bintang tidak setuju, menurutnya produktivitas bergantung pada sistem dan kebiasaan, bukan lokasi. Kafe hanya ilusi perubahan yang sementara.",
  },
  {
    episodeId: "ep3",
    speakerA: GUESTS[1],
    summaryA: "Pandji berpendapat gaji besar di pekerjaan yang tidak disukai lebih baik daripada gaji kecil di passion. Finansial yang aman membuka lebih banyak pilihan hidup.",
    speakerB: HOSTS[0],
    summaryB: "Arif berargumen bahwa mengerjakan sesuatu yang tidak kamu sukai dalam jangka panjang menguras energi mental dan berakhir lebih mahal dari sisi kesehatan.",
  },
  {
    episodeId: "ep3",
    speakerA: HOSTS[1],
    summaryA: "Bintang percaya feedback negatif dari atasan harus diterima dengan lapang dada karena itu bagian dari pertumbuhan profesional.",
    speakerB: HOSTS[2],
    summaryB: "Gilang membedakan antara feedback konstruktif dan kritik tidak produktif. Tidak semua masukan layak diterima, dan kemampuan menyaring itu penting.",
  },
  {
    episodeId: "ep4",
    speakerA: GUESTS[2],
    summaryA: "Raditya berpendapat bahwa membangun personal branding di media sosial adalah keharusan di era ini, terutama untuk karier kreatif.",
    speakerB: HOSTS[2],
    summaryB: "Gilang skeptis dengan personal branding berlebihan. Kualitas kerja yang konsisten lebih sustainable daripada pencitraan online.",
  },
  {
    episodeId: "ep4",
    speakerA: HOSTS[0],
    summaryA: "Arif berpendapat multitasking adalah kebohongan produktivitas. Otak manusia tidak bisa benar-benar melakukan dua hal penting secara bersamaan.",
    speakerB: GUESTS[0],
    summaryB: "Adi berargumen bahwa multitasking untuk tugas rutin dan otomatis sangat mungkin dan efisien. Yang tidak bisa adalah dua tugas kognitif berat sekaligus.",
  },
  {
    episodeId: "ep5",
    speakerA: HOSTS[1],
    summaryA: "Bintang percaya resign tanpa backup pekerjaan baru adalah keputusan berani yang kadang diperlukan untuk keluar dari lingkungan kerja toxic.",
    speakerB: GUESTS[1],
    summaryB: "Pandji lebih konservatif, berargumen bahwa negosiasi dan komunikasi internal harus dieksplor habis sebelum memutuskan keluar, terutama soal stabilitas finansial.",
  },
  {
    episodeId: "ep5",
    speakerA: HOSTS[2],
    summaryA: "Gilang berpendapat gelar akademik masih sangat relevan dan membuka pintu yang tidak bisa dibuka jalur lain untuk profesi tertentu.",
    speakerB: GUESTS[2],
    summaryB: "Raditya lebih percaya pada portofolio dan track record nyata. Di industri kreatif, apa yang sudah kamu buat jauh lebih berbicara daripada ijazah.",
  },
];

async function seedBattles() {
  console.log("Seeding battles...");
  const batch = db.batch();
  BATTLES.forEach((b, i) => {
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

module.exports = seedBattles;
