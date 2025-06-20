const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./app/db/DB0231456");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret ', // use a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 } // 1 minute (adjust as needed)
}));

app.use(cors({
  origin: "http://localhost:3000", // your React frontend or EJS frontend if needed
  methods: ["GET", "POST"],
  credentials: true,               // allow cookies
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



// --- ROUTES SETUP START ---
// Import routes
app.use("/Asur", require("./app/router/admin/index"));
app.use("/", require("./app/router/ui/protfoliopages.routes"));

// --- SOCKET.IO SETUP END ---

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

