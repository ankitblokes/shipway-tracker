// Replace Shipway with Delhivery
const DELHIVERY_API = "https://track.delhivery.com/api/v1/packages/json/?waybill=";
const DELHIVERY_TOKEN = "7A149TU34s8N69g07eO1gB1q33s3ci0a"; // <-- apna Delhivery API token yaha daalo

// Tracking check inside handleSend()
if (txt.toLowerCase().startsWith("track")) {
  const parts = txt.split(" ");
  if (parts.length < 2) {
    appendMessage("⚠️ Please enter like: track <AWB_NUMBER>", "bot");
    return;
  }

  const awb = parts[1];
  appendMessage("⏳ Fetching tracking info...", "bot");

  try {
    const res = await fetch(`${DELHIVERY_API}${awb}`, {
      method: "GET",
      headers: {
        "Authorization": "Token " + DELHIVERY_TOKEN,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    if (data?.ShipmentData?.length > 0) {
      const shipment = data.ShipmentData[0].Shipment;
      const scans = shipment.Scans || [];

      let latest = scans.length ? scans[scans.length - 1] : null;

      appendMessage(
        `📦 Tracking Info:\n` +
        `• AWB: ${shipment.Waybill}\n` +
        `• Status: ${latest?.ScanDetail?.ScanType || "N/A"}\n` +
        `• Remark: ${latest?.ScanDetail?.Instructions || "N/A"}\n` +
        `• Date: ${latest?.ScanDetail?.ScanDateTime || "N/A"}\n` +
        `• Origin: ${shipment.Origin || "N/A"} → Destination: ${shipment.Destination || "N/A"}\n` +
        `• Courier: Delhivery`,
        "bot"
      );

    } else {
      appendMessage("❌ No tracking info found for this AWB.", "bot");
    }
  } catch (err) {
    appendMessage("⚠️ Error fetching tracking info: " + err.message, "bot");
  }
  return; // stop product search
}
