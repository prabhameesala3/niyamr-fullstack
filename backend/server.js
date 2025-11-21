require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const checkRoutes = require("./routes/check");

// ------------------------------
// Create Express app
// ------------------------------
const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------
// Setup upload directory
// ------------------------------
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ------------------------------
// Health Check
// ------------------------------
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ------------------------------
// Upload PDF Route
// ------------------------------
app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const buffer = fs.readFileSync(req.file.path);

    let parsed = { text: "", numpages: 1 };

    try {
      parsed = await pdfParse(buffer);
    } catch (err) {
      console.error("PDF Error:", err);
      parsed.text = buffer.toString("utf8");
    }

    res.json({
      text: parsed.text || "",
      pages: parsed.numpages || 1,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error.message);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

// ------------------------------
// Rule checking (LLM)
// ------------------------------
app.use("/check-rules", checkRoutes);

// ------------------------------
// Start Server
// ------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});