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

const buildShipmentFeedbackPayload = (data) => {
  const formData = new FormData();
  formData.append('rating', data.rating);
  if (data.feedback_message) {
    formData.append('feedback_message', data.feedback_message);
  }
  if (Array.isArray(data.feedback_images)) {
    data.feedback_images.forEach((image) => {
      formData.append('feedback_images[]', image);
    });
  }
  return formData;
};

export const submitShipmentFeedback = async (id, data) => {
  const response = await api.post(
    `/shipments/${id}/feedback`,
    buildShipmentFeedbackPayload(data)
  );
  return response.data.data.shipment;
};

export const updateShipmentFeedback = async (id, data) => {
  const response = await api.put(
    `/shipments/${id}/feedback`,
    buildShipmentFeedbackPayload(data)
  );
  return response.data.data.shipment;
};

export const updateShipmentStatus = async (id) => {
  const response = await api.put(
    `/shipments/${id}/status`
  );

  return response.data;
};