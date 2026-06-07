import api from "../api/xios";

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data?.data || response.data || {};
};

export const createCategory = async (data) => {
  const response = await api.post("/admin/categories", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.put(`/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};