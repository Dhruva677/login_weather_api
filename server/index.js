require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const SALT_ROUNDS = 10;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
    origin: [
        "http://localhost:5173",   // Vite dev server
        "http://localhost:4173",   // Vite preview
        process.env.FRONTEND_URL,  // Production (Vercel URL set as env var)
    ].filter(Boolean),
    credentials: true,
}));
app.use(express.json());

// ─── SQLite Connection ────────────────────────────────────────────────────────
const dbPath = path.join(__dirname, "auth.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ SQLite connection failed:", err.message);
        process.exit(1);
    }
    console.log("✅ Connected to SQLite database.");
    createUsersTable();
});

// ─── Auto-create users table ──────────────────────────────────────────────────
function createUsersTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      username   TEXT NOT NULL UNIQUE,
      password   TEXT NOT NULL,
      email      TEXT NOT NULL UNIQUE,
      phone      TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
    db.run(sql, (err) => {
        if (err) {
            console.error("❌ Failed to create users table:", err.message);
        } else {
            console.log("✅ Users table ready.");
        }
    });
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check
app.get("/", (req, res) => {
    res.json({ status: "CineVault API is running (SQLite) 🎬" });
});

// POST /register
app.post("/register", async (req, res) => {
    const { username, password, email, phone } = req.body;

    if (!username || !password || !email || !phone) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const sql = "INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)";
        db.run(sql, [username, hashedPassword, email, phone], function (err) {
            if (err) {
                if (err.message.includes("UNIQUE constraint failed")) {
                    const field = err.message.includes("username") ? "Username" : "Email";
                    return res.status(409).json({ message: `${field} is already taken.` });
                }
                console.error("Register DB error:", err);
                return res.status(500).json({ message: "Server error. Please try again." });
            }
            res.status(201).json({ message: "Account created successfully!", userId: this.lastID });
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

// POST /login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.get(sql, [username], async (err, user) => {
        if (err) {
            console.error("Login DB error:", err);
            return res.status(500).json({ message: "Server error. Please try again." });
        }
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        try {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ message: "Invalid username or password." });
            }
            res.json({
                message: "Login successful!",
                username: user.username,
                email: user.email,
            });
        } catch (err) {
            console.error("bcrypt compare error:", err);
            res.status(500).json({ message: "Server error. Please try again." });
        }
    });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
