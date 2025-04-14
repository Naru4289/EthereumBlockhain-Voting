const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static React files
app.use(express.static(path.join(__dirname, "build")));

// Serve React app on all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start server on all interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
