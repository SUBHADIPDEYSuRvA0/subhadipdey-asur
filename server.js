const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const path = require("path");
const fetch = require("node-fetch"); // <-- ADD THIS LINE
const cookieParser = require("cookie-parser");
const connectDB = require("./app/db/DB0231456");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret', // use a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 } // 1 minute (adjust as needed)
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up EJS
app.set("view engine", "ejs");
app.set("views", "views");

// Public folders
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; 

app.post('/api/chat', async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const userMessage = req.body.message;
    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // a model that actually exists on OpenRouter
        model: 'google/gemini-2.0-flash-exp:free',
        temperature: 0.0,          // lock randomness
        seed: 123456,              // repeatable results
        max_tokens: 200,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant named Asur, created by Subhadip Dey.'
          },
          { role: 'user', content: userMessage }
        ]
      })
    });
    const data = await aiRes.json();
    if (aiRes.ok && data.choices && data.choices[0]) {
      res.json({ reply: data.choices[0].message.content.trim() });
    } else {
      res.json({ reply: data.error?.message || "❌ Sorry, I couldn’t understand that." });
    }
  } catch (err) {
    res.status(500).json({ reply: `⚠️ Error: ${err.message}` });
  }
});
// --- ROUTES SETUP START ---
app.use("/Asur", require("./app/router/admin/index"));
app.use("/", require("./app/router/ui/protfoliopages.routes"));

// --- SOCKET.IO SETUP END ---

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
