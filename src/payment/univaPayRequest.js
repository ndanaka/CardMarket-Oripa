import { univaPayConfig } from "./univaPayConfig";

export const initiateUnivaPayTransaction = async (amount) => {
  const body = {
    amount: amount,
    currency: "JPY", // Japanese Yen
    description: `${amount} points purchase`,
    capture: true, // Automatically capture the charge
    customer: {
      email: "customer@example.com",
    },
    paymentType: "card", // Assuming you are using card payments
  };

  const response = await fetch(univaPayConfig.apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${univaPayConfig.apiKey}`,

      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    body: JSON.stringify(body),
  });

  console.log(response);

  if (!response.ok) {
    throw new Error("Payment failed");
  }

  const data = await response.json();
  return data;
};
