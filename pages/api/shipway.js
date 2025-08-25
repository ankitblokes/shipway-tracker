export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const { order_id } = req.body;
  
      const response = await fetch("https://shipway.in/api/getShipmentDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.SHIPWAY_API_KEY}`, // .env file se key
        },
        body: JSON.stringify({ order_id }),
      });
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to fetch tracking info" });
    }
  }
  