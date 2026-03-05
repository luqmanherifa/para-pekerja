const { TODAY } = require("./config.cjs");
const seedUsers = require("./seedUsers.cjs");
const seedAttendance = require("./seedAttendance.cjs");
const seedJobs = require("./seedJobs.cjs");
const seedQuotes = require("./seedQuotes.cjs");
const seedBattles = require("./seedBattles.cjs");
const seedGuests = require("./seedGuests.cjs");

async function main() {
  console.log("\nPara Pekerja — Seeder");
  console.log(`Tanggal : ${TODAY}`);
  console.log("─────────────────────\n");

  try {
    await seedUsers();
    await seedAttendance();
    await seedJobs();
    await seedQuotes();
    await seedBattles();
    await seedGuests();

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
