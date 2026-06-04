import api from "../api/xios";

export const createShipment = async (data) => {
  const response = await api.post("/shipments", {
    request_id: Number(data.request_id),
    courier: data.courier,
    tracking_number: data.tracking_number,
    cod_amount: data.cod_amount || 0,
  });

  return response.data;
};

export const getShipment = async (id) => {
  const response = await api.get(`/shipments/${id}`);
  return response.data.data.shipment; // langsung, karena struktur sudah jelas
};

export const updateShipmentStatus = async (id) => {
  const response = await api.put(
    `/shipments/${id}/status`
  );

  return response.data;
};