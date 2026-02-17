require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDB } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/score", require("./routes/scoreRoutes"));

initDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
  });

