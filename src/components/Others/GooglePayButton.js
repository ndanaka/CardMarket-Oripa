// GooglePayButton.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { showToast } from '../../utils/toastUtil';
const GooglePayButton = () => {
  const [isReady, setIsReady] = useState(false);
  const googlePayClient = new window.google.payments.api.PaymentsClient({ environment: 'TEST' }); //use PRODUCTION for live

  const request = {
    apiVersion: 2,
    apiVersionMinor: 0,
    merchantInfo: {
      merchantId: 'YOUR_MERCHANT_ID', // Replace with your Merchant ID
      merchantName: 'Example Merchant',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: '10.00', // Total amount
      currencyCode: 'USD', // Currency
      countryCode: 'US', // Country
    },
    cardRequirements: {
      allowedCardNetworks: ['MASTERCARD', 'VISA'],
      billingAddressRequired: true,
      billingAddressParameters: {
        format: 'FULL',
        phoneNumberRequired: false,
      },
    },
  };

  useEffect(() => {
    googlePayClient.isReadyToPay({ apiVersion: 2, apiVersionMinor: 0 })
      .then(response => {
        setIsReady(response.result);
      })
      .catch(err => {
        console.error("Error checking Google Pay readiness: ", err);
      });
  }, [googlePayClient]);

  const handlePayment = () => {
    googlePayClient.loadPaymentData(request)
      .then(paymentData => {
        // Process payment data
        api.post("/payment/google_pay", paymentData).then((res) => {
            if(res.data.status === 1) {
                showToast("Payment successful!")
            } else showToast("Payment Failed: ", res.data.msg)
        }).catch((err) => {

            console.error('Error processing payment: ', err);
        })
        console.log(paymentData);
        // Send paymentData to your server for processing
      })
      .catch(err => {
        console.error("Error loading payment data: ", err);
      });
  };

  return (
    <>
      {isReady && (
        <button onClick={handlePayment}>Pay with Google Pay</button>
      )}
    </>
  );
};

export default GooglePayButton;
