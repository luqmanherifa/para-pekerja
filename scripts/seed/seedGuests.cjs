const { db, now, GUESTS } = require("./config.cjs");

async function seedGuests() {
  console.log("Seeding guests...");
  const batch = db.batch();
  GUESTS.forEach((g) => {
    batch.set(db.collection("guests").doc(g.id), {
      guestId: g.id,
      voteCount: Math.floor(Math.random() * 40) + 5,
      voters: [],
      createdAt: now,
    });
  });
  await batch.commit();
  console.log("  ✓ guests");
}

module.exports = seedGuests;
