const { db, now, FAKE_USERS } = require("./config.cjs");

async function seedUsers() {
  console.log("Seeding users...");
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
  console.log("  ✓ users");
}

module.exports = seedUsers;
