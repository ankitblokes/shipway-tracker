// /pages/api/track.js
import Cors from "cors"
import initMiddleware from "../../lib/init-middleware"

// ✅ Initialize CORS middleware
const cors = initMiddleware(
  Cors({
    methods: ["POST", "OPTIONS"],
    origin: [
      "https://supersox.com",
      "https://www.supersox.com",
      "http://localhost:3000" // ✅ optional: for local dev testing
    ],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

export default async function handler(req, res) {
  // Run CORS
  await cors(req, res)

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { awb } = req.body

    if (!awb) {
      return res.status(400).json({ status: "Error", message: "AWB required" })
    }

    // 🚀 Call Shipway API
    const resp = await fetch("https://shipway.in/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(
          `${process.env.SHIPWAY_EMAIL}:${process.env.SHIPWAY_API_KEY}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({ awb }),
    })

    // Parse Shipway response
    const data = await resp.json()

    return res.status(200).json({ status: "Success", response: data })
  } catch (err) {
    console.error("❌ Shipway API error:", err)
    return res.status(500).json({ status: "Error", message: err.message })
  }
}
