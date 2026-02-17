require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

(async () => {
  try {
    const users = await sql`SELECT * FROM users`;
    console.log("Users:", JSON.stringify(users, null, 2));

    const scores = await sql`SELECT * FROM scores`;
    console.log("Scores:", JSON.stringify(scores, null, 2));
  } catch (e) {
    console.error("Error:", e.message);
  }
  process.exit(0);
})();
