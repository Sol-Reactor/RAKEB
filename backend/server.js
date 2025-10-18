import dotenv from 'dotenv';
import path from 'path';
dotenv.config(); 
// 1. Configure dotenv at the very top, before any other imports
// that might need environment variables.


import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import arcjet, { shield } from "@arcjet/node";

import productRoutes from './routes/productRoutes.js';
import { sql } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({
      mode: "LIVE", 
    }),
  ],
});

// Register body parser and other middleware before routes so req.body is available
app.use(express.json());
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "images.unsplash.com", "data:"],
    },
  },
}));
app.use(morgan('dev'));


// apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }

    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});

app.use("/api/products", productRoutes);



if (process.env.NODE_ENV === "production") {
  // server our react app
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // Use a regex to match any path that doesn't start with /api/
  // This is a more robust way to handle the catch-all for SPAs
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}


// Connect to the database and create tables if they don't exist

async function connectDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            image VARCHAR(100) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
        // Ensure `image` column can hold long URLs. If the column already
        // exists with a small VARCHAR, alter it to TEXT (idempotent if already TEXT).
        try {
            await sql`ALTER TABLE products ALTER COLUMN image TYPE TEXT`;
        } catch (e) {
            // Some DBs may throw if the column type is already TEXT or if the
            // table/column doesn't exist yet; ignore such errors here.
        }
       console.log("Connected to the database successfully.");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}



connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});




export default app;