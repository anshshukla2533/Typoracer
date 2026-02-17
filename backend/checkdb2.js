require("dotenv").config();
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

(async () => {
  try {
    // Test parameterized query the same way pool.query does it
    const result = await sql("INSERT INTO users (email, password) VALUES ($1, $2)", ["wrappertest@test.com", "hash456"]);
    console.log("Insert result:", result);

    const users = await sql("SELECT * FROM users", []);
    console.log("Users after insert:", JSON.stringify(users, null, 2));
  } catch (e) {
    console.error("Error:", e.message, e);
  }
  process.exit(0);
})();
