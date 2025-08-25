// pages/api/track.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const { awb } = req.body;
  
      if (!awb) {
        return res.status(400).json({ status: "Error", message: "AWB required" });
      }
  
      // 🚀 Shipway API call
      const resp = await fetch("https://shipway.in/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.SHIPWAY_API_KEY}`, // env key lagana
        },
        body: JSON.stringify({ awb }),
      });
  
      const data = await resp.json();
  
      return res.status(200).json({ status: "Success", response: data });
    } catch (err) {
      return res.status(500).json({ status: "Error", message: err.message });
    }
  }
  