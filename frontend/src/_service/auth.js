import api from "../api/xios";

//auth dari login
export const login = async (data) => {
  const response = await api.post("/login", data);
  return response.data;
};

//auth dari register 
export const register = async (data) => {
  const response = await api.post("/register", data);
  return response.data;
};

//profile 
export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};