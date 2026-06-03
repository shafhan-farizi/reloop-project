import axios from "axios";

const API = "http://127.0.0.1:8000/api/admin/notifications";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getNotif = async (params) => {
  return await axios.get(API, {
    headers: headers(),
    params,
  });
};

export const deleteNotif = async (id) => {
  return await axios.delete(`${API}/${id}`, {
    headers: headers(),
  });
};

export const sendNotif = async (data) => {
  return await axios.post(`${API}/send`, data, {
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
  });
};

export const broadcastNotif = async (data) => {
  return await axios.post(`${API}/broadcast`, data, {
    headers: {
      ...headers(),
      "Content-Type": "application/json",
    },
  });
};