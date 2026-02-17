const express = require("express");
const auth = require("../middleware/authMiddleware");
const { pool } = require("../db");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { wpm } = req.body;
    await pool.query("INSERT INTO scores (user_email, wpm) VALUES ($1, $2)", [
      req.user.email,
      wpm,
    ]);
    res.send("Score saved");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_email AS user, wpm FROM scores ORDER BY wpm DESC LIMIT 50"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
