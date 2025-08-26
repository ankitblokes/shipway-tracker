// track.js
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// API endpoint for tracking
app.post("/track", async (req, res) => {
  const { waybill } = req.body;

  try {
    const response = await fetch("https://shipway.in/api/getShipmentDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "YOUR_SHIPWAY_EMAIL",   // yaha apna Shipway email
        password: "YOUR_SHIPWAY_API_KEY", // yaha apna API key
        waybill: waybill                  // frontend se aayega
      })
    });

    const data = await response.json();
    res.json(data); // frontend/chatbot ko bhej do
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// run server
app.listen(3000, () => console.log("✅ Tracker running on http://localhost:3000"));
