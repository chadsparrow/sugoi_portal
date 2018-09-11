const express = require("express");

// Constants
const PORT = 5000;
const HOST = "localhost";

// App
const app = express();

app.get("/", (req, res) => {
  res.send("SUGOI Custom Proofs - REST API Server");
});

app.listen(PORT, (req, res) => {
  console.log(`REST API running on http://${HOST}:${PORT}`);
});
