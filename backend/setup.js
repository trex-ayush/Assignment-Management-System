const pool = require("./config/db");
const fs = require("fs");
const path = require("path");

async function setupDatabase() {
  console.log("🔄 Setting up database...");

  try {
    const schemaPath = path.join(__dirname, "models/schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    await pool.query(schema);

    console.log("✅ Database tables created successfully!");
    console.log("\nCreated tables:");
    console.log("  - users");
    console.log("  - groups");
    console.log("  - group_members");
    console.log("  - assignments");
    console.log("  - assignment_groups");
    console.log("  - submissions");

    process.exit(0);
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

setupDatabase();
