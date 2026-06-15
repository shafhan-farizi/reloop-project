import api from "../api/xios";

//auth dari login
export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

//auth dari register 
export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

//profile 
export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put("/user/profile", data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put("/user/change-password", data);
  return response.data;
};
