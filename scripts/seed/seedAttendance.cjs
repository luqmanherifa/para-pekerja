const { db, now, TODAY, FAKE_USERS, MOODS, buildPayslip } = require("./config.cjs");

async function seedAttendance() {
  console.log("Seeding attendance...");
  const batch = db.batch();
  const moodStats = {};

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
  });

  batch.set(db.collection("attendance_stats").doc("global"), {
    total: FAKE_USERS.length,
    moods: moodStats,
  });

  await batch.commit();
  console.log("  ✓ attendance, attendance_stats/global");
}

module.exports = seedAttendance;
