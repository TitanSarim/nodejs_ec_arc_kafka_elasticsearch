const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db.js");

require("dotenv").config();

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });
};

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    return res
      .status(200)
      .json({ message: "User created", user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (!user.rows.length) {
      return res.status(401).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email,
    });

    return res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/validate", async (req, res) => {
  try {
    console.log("req.header", req.header);
    const token = req.headers.Authorization || req.headers.authorization;
    console.log("token", token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tokenData = token.split(" ")[1];
    const user = jwt.verify(tokenData, process.env.JWT_SECRET);

    return res.json({ ...user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
