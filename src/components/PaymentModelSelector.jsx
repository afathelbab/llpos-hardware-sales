import React from "react";

const PaymentModelSelector = ({
  paymentOption,
  setPaymentOption,
  downPayment,
  setDownPayment,
}) => {
  return (
    <>
      <label className="fw-bold text-dark">Select Payment Model:</label>
      <div className="mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="paymentModel"
            value="purchasing"
            checked={paymentOption === "purchasing"}
            onChange={(e) => setPaymentOption(e.target.value)}
          />
          <label className="form-check-label">Purchasing</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="paymentModel"
            value="financing_downpayment"
            checked={paymentOption === "financing_downpayment"}
            onChange={(e) => setPaymentOption(e.target.value)}
          />
          <label className="form-check-label">Financing with Down Payment</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="paymentModel"
            value="financing_no_downpayment"
            checked={paymentOption === "financing_no_downpayment"}
            onChange={(e) => setPaymentOption(e.target.value)}
          />
          <label className="form-check-label">
            Financing without Down Payment
          </label>
        </div>
      </div>
      {paymentOption === "financing_downpayment" && (
        <div className="mb-4">
          <label className="fw-bold text-dark">
            Down Payment (Minimum 1000 DKK)
          </label>
          <input
            type="number"
            className="form-control"
            value={downPayment}
            placeholder="1000"
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setDownPayment(value === "" ? 1000 : Number(value));
              }
            }}
            onBlur={(e) => {
              if (
                Number(e.target.value) < 1000 ||
                isNaN(Number(e.target.value))
              ) {
                setDownPayment(1000);
              }
            }}
          />
        </div>
      )}
    </>
  );
};

export default PaymentModelSelector;
