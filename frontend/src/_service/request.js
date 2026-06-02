import api from "../api/xios";

export const getApprovedRequests = async () => {
  const response = await api.get(
    "/requests/incoming?status=approved"
  );

  return response.data;
};