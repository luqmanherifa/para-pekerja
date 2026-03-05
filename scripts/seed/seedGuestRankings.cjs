const { db, now, GUESTS } = require("./config.cjs");

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

module.exports = seedGuestRankings;
