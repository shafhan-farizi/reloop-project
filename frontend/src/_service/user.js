import api from "../api/xios";

export const getUsers = async (params) => {
  const response = await api.get(
    "/admin/users",
    { params }
  );

  return response.data;
};

export const toggleUserStatus =
  async (id) => {
    const response =
      await api.put(
        `/admin/users/${id}/toggle-active`
      );

    return response.data;
  };