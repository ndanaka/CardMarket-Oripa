// Checkout.js
import React from 'react';
import GooglePayButton from '../Others/GooglePayButton';

const GooglePayCheck = () => {
  return (
    <div>
      <h1>Google Payment Check</h1>
      <p>Total: $10.00</p>
      <GooglePayButton />
    </div>
  );
};

export default GooglePayCheck;
