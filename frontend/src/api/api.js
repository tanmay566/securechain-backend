const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message = data?.detail || data?.error || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  baseUrl: API_BASE_URL,

  health: () => request("/health"),
  dashboardStats: () => request("/dashboard/stats"),

  assets: {
    list: () => request("/assets"),
    getStatus: (assetId) => request(`/assets/${encodeURIComponent(assetId)}/status`),
    create: (asset) => request("/assets/register", {
      method: "POST",
      body: JSON.stringify({
        name: asset.name,
        full_name: asset.fullName || asset.name,
        asset_id: asset.assetId || asset.id,
        batch_number: asset.batchNumber || null,
        category: asset.category || "Vaccines",
        manufacturer: asset.manufacturer || "",
        manufacturing_address: asset.manufacturingAddress || null,
        manufacturing_date: asset.manufacturingDate || null,
        expiry_date: asset.expiryDate || null,
        storage_requirement: asset.storageRequirement || asset.temperatureRange || null,
        quantity: asset.quantity || null,
        origin: asset.origin || null,
        destination: asset.destination || null,
        transport_mode: asset.transportMode || null,
        vehicle_number: asset.vehicleNumber || null,
        driver: asset.driver || null,
        dispatch_date: asset.dispatchDate || null,
        expected_delivery: asset.expectedDelivery || null,
        status: asset.status || "Registered",
      }),
    }),
    event: (assetId, eventType, org, detail = {}) => request(`/assets/${encodeURIComponent(assetId)}/events`, {
      method: "POST",
      body: JSON.stringify({ event_type: eventType, org, detail }),
    }),
    temperature: (assetId, temperature) => request(`/assets/${encodeURIComponent(assetId)}/temperature`, {
      method: "POST",
      body: JSON.stringify({ temperature }),
    }),
    revoke: (assetId, reason, revokedBy = "VITALChain Hospital") => request(`/assets/${encodeURIComponent(assetId)}/revoke`, {
      method: "POST",
      body: JSON.stringify({ reason, revoked_by: revokedBy }),
    }),
    qrData: (assetId) => request(`/assets/${encodeURIComponent(assetId)}/qr-data`),
    qrImageUrl: (assetId) => `${API_BASE_URL}/assets/${encodeURIComponent(assetId)}/qr`,
  },

  vaccinations: {
    register: (data) => request("/vaccinations/register", {
      method: "POST",
      body: JSON.stringify({
        full_name: data.fullName,
        phone: data.phone,
        asset_id: data.assetId,
        hospital: data.hospital || "VITALChain Hospital",
      }),
    }),
    list: () => request("/vaccinations"),
    get: (id) => request(`/vaccinations/${encodeURIComponent(id)}`),
  },

  payments: {
    create: (data) => request("/payments/create", {
      method: "POST",
      body: JSON.stringify({
        asset_id: data.assetId || null,
        amount_usdc: String(data.amountUsdc || "0.01"),
        recipient: data.recipient || null,
        network: data.network || null,
      }),
    }),
    get: (orderId) => request(`/payments/${encodeURIComponent(orderId)}`),
    receipt: (orderId, receipt) => request(`/payments/${encodeURIComponent(orderId)}/receipt`, {
      method: "POST",
      body: JSON.stringify({
        transaction_hash: receipt.transactionHash || receipt.txHash || null,
        payer: receipt.payer || null,
        network: receipt.network || null,
        success: receipt.success !== false,
        raw: receipt.raw || receipt,
      }),
    }),
  },
};

export default api;
