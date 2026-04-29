// server.js
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

const ACCESS_TOKEN_SECRET = "ACCESS_SECRET";
const REFRESH_TOKEN_SECRET = "REFRESH_SECRET";

// In-memory refresh token storage for demo
let refreshTokens = [];

// Dummy user
const user = { id: 1, username: "testuser", password: "123456" };

// 1️⃣ Login endpoint → returns access token + sets refresh token cookie
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== user.username || password !== user.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  refreshTokens.push(refreshToken); // store refresh token

  // Set refresh token in HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // set true if HTTPS
    sameSite: "strict",
  });

  res.json({ accessToken });
});

// 2️⃣ Refresh endpoint → gives new access token
app.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);
  if (!refreshTokens.includes(token)) return res.sendStatus(403);

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, userData) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign({ id: userData.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    res.json({ accessToken });
  });
});

// 3️⃣ Protected route → requires access token
app.get("/profile", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, userData) => {
    if (err) return res.sendStatus(403);
    res.json({ id: userData.id, username: user.username });
  });
});

// 4️⃣ Logout → remove refresh token
app.post("/logout", (req, res) => {
  const token = req.cookies.refreshToken;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.clearCookie("refreshToken");
  res.sendStatus(204);
});

app.listen(5000, () => console.log("Server running on port 5000"));
