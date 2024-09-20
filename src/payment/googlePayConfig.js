export const googlePayConfig = {
  environment: "TEST", // Change to 'PRODUCTION' when ready
  paymentDataRequest: {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["MASTERCARD", "VISA"],
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "example", // Replace 'example' with your gateway
            gatewayMerchantId: "exampleMerchantId", // Your merchant ID
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: "your-merchant-id", // Your Merchant ID
      merchantName: "Your Merchant Name",
    },
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPrice: "500.00", // Will be dynamically updated
      currencyCode: "JPY",
      countryCode: "JP",
    },
  },
};
