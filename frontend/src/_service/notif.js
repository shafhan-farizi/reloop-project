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

// User notifications
export const getUserNotifications = async (params) => {
  return await axios.get(`${BASE_URL}/notifications`, {
    headers: headers(),
    params,
  });
};

export const markNotificationAsRead = async (id) => {
  return await axios.put(`${BASE_URL}/notifications/${id}/read`, null, {
    headers: headers(),
  });
};

export const markAllNotificationsAsRead = async () => {
  return await axios.put(`${BASE_URL}/notifications/read-all`, null, {
    headers: headers(),
  });
};