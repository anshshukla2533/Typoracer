require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

(async () => {
  try {
    // Test 1: sql.query() with params
    console.log("Testing sql.query()...");
    const r1 = await sql.query("SELECT * FROM users");
    console.log("sql.query SELECT:", JSON.stringify(r1));

    // Test 2: sql.query() insert
    console.log("\nTesting sql.query() INSERT...");
    const r2 = await sql.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *", ["sqlquery_test@test.com", "hash789"]);
    console.log("sql.query INSERT:", JSON.stringify(r2));

    // Test 3: verify
    const r3 = await sql`SELECT * FROM users`;
    console.log("\nAll users after:", JSON.stringify(r3));
  } catch (e) {
    console.error("Error:", e.message);
    console.error(e);
  }
  process.exit(0);
})();
