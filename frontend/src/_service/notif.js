import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Admin - list
export const getNotif = async (params) => {
  return await axios.get(`${BASE_URL}/admin/notifications`, {
    headers: headers(),
    params,
  });
};

// Admin - send
export const sendNotif = async (data) => {
  return await axios.post(
    `${BASE_URL}/admin/notifications/send`,
    data,
    {
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
    }
  );
};

// Admin - broadcast
export const broadcastNotif = async (data) => {
  return await axios.post(
    `${BASE_URL}/admin/notifications/broadcast`,
    data,
    {
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
    }
  );
};