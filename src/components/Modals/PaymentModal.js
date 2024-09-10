import React, { useState } from "react";

const PaymentForm = ({ isOpen, onClose, onConfirm }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
      setError("All fields are required.");
      return;
    }

    // Call the payment processing function
    processPayment({ cardNumber, expiryDate, cvv, nameOnCard });
  };

  const processPayment = async (paymentData) => {
    // Mock payment processing logic
    try {
      // Simulate an API call
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate successful payment
          resolve({ success: true });
        }, 2000);
      });

      if (response.success) {
        setSuccess("Payment successful!");
      }
    } catch (error) {
      setError("Payment failed. Please try again.");
    }
  };
  if (!isOpen) return null;
  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Payment Information</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="1234 5678 9012 3456"
            
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Expiry Date (MM/YY)</label>
          <input
            type="text"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="MM/YY"
            
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">CVV</label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="123"
            
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Name on Card</label>
          <input
            type="text"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="John Doe"
            
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            className="bg-gray-500 text-white rounded p-2 mr-2 w-full"
            onClick={() => onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded p-2 w-full"
          >
            Pay Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
