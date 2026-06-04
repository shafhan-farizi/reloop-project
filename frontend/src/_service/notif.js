import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ✅ ADMIN - GET LIST
export const getNotif = async (params) => {
  return await axios.get(`${BASE_URL}/admin/notifications`, {
    headers: headers(),
    params,
  });
};

// ✅ ADMIN - SEND
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

// ✅ ADMIN - BROADCAST
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