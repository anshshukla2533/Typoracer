const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { pool } = require("../db");

const router = express.Router();
const secret = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).send("User already exists");
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hash]);
    res.send("Registered");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(404).send("user not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send("wrong password");

    const token = jwt.sign({ email }, secret);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;