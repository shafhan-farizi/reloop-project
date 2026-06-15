import api from "../api/xios";

export const getApprovedRequests = async () => {
  const response = await api.get(
    "/requests/incoming?status=approved"
  );

  return response.data;
};

export const getIncomingRequests = async (params = {}) => {
  const response = await api.get("/requests/incoming", { params });
  return response.data.data;
};

export const approveRequest = async (id) => {
  const response = await api.put(`/requests/${id}/approve`);
  return response.data;
};

export const rejectRequest = async (id, reason = "Request ditolak oleh donatur.") => {
  const response = await api.put(`/requests/${id}/reject`, {
    rejection_reason: reason,
  });
  return response.data;
};

export const getUserRequests = async (params = {}) => {
  const response = await api.get('/requests', { params });
  const data = response.data?.data || {};
  return {
    requests: data.requests || [],
    meta: data.meta || {},
  };
};

export const createRequest = async (data) => {
  const response = await api.post('/requests', data);
  return response.data.data.request;
};