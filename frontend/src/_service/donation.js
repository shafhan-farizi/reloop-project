const BASE_URL = "http://127.0.0.1:8000/api";

export async function getDonationHistory(token, page = 1) {
  const res = await fetch(
    `${BASE_URL}/admin/requests?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  return res.json();
}