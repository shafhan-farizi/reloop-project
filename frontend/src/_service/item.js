import api from "../api/xios";

export const getAdminItems = async (params = {}) => {
  const response = await api.get("/admin/items", { params });
  return response.data.data;
};

export const getPublicItems = async (params = {}) => {
  const response = await api.get("/items", { params });
  return response.data.data;
};

export const createAdminItem = async (data) => {
  const response = await api.post("/items", data);
  return response.data;
};


//feat:notifikasi dan topbar
export const getMyItems = async (params = {}) => {
  const response = await api.get("/user/items", { params });
  return response.data.data;
};

export const getItem = async (id) => {
  const response = await api.get(`/items/${id}`);
  return response.data.data.item;
};

export const updateItem = async (id, data) => {
  const response = await api.put(`/items/${id}`, data);
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await api.delete(`/items/${id}`);
  return response.data;
};


export const updateAdminItem = async (id, data) => {
  data.append("_method", "PUT");

  const response = await api.post(`/items/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateAdminItemImages = async (id, data) => {
  const response = await api.post(`/items/${id}/images`, data);
  return response.data;
};

export const deleteAdminItem = async (id) => {
  const response = await api.delete(`/admin/items/${id}`);
  return response.data;
};