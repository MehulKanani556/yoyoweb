require("dotenv").config();
const express = require("express");
const connectDb = require("./db/db");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const indexRoutes = require("./routes/index.routes");
const rateLimit = require("express-rate-limit");

const app = express();

// Essential middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Place rate limiter here
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );

app.use(helmet());
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.hidePoweredBy());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "*.amazonaws.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "*.amazonaws.com"],
      connectSrc: [
        "'self'",
        "http://localhost:3001",
        "http://localhost:3000",
        "http://192.168.29.126:3000",
        "*.amazonaws.com",
      ],
      mediaSrc: ["'self'", "*.amazonaws.com"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      manifestSrc: ["'self'"],
    },
    reportOnly: false,
  })
);
app.use(helmet.crossOriginEmbedderPolicy({ policy: "require-corp" }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cookieParser());
const port = process.env.PORT || 8000;

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "http://192.168.29.126:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "Range",
      "Accept",
      "Origin",
      "Access-Control-Allow-Headers",
    ],
    exposedHeaders: [
      "Content-Length",
      "Content-Range",
      "Content-Type",
      "Accept-Ranges",
      "ETag",
    ],
    credentials: true,
    maxAge: 3600,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", indexRoutes);

// Start the server
app.listen(port, () => {
  connectDb();
  console.log(
    `Worker ${process.pid} started. Server is running on port ${port}`
  );
});
