const { db, now, FAKE_USERS, HOSTS, GUESTS, EPISODE_LABELS } = require("./config.cjs");

const QUOTES = [
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

async function seedQuotes() {
  console.log("Seeding quotes...");
  const batch = db.batch();
  QUOTES.forEach((q, i) => {
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

module.exports = seedQuotes;
