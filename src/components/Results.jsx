import React from "react";

const Results = ({
  modifiedRevenue,
  annualRevenue,
  revenueCategory,
  commission,
  transactionPercent,
  paymentOption,
  fullPurchasePrice,
  installment,
  evaluateRevenueCategory,
}) => {
  return (
    <div className="p-4 bg-light rounded shadow-lg" style={{ border: "2px solid red" }}>
      <h3 className="text-secondary text-center">Results</h3>
      <button className="btn btn-info w-100" onClick={evaluateRevenueCategory}>
        Show Details
      </button>
      {modifiedRevenue && (
        <div className="mt-3 p-3 border rounded bg-white text-center">
          <p>
            <strong>Modified Monthly Revenue:</strong> {modifiedRevenue.toLocaleString()} DKK
          </p>
          <p>
            <strong>Annual Revenue:</strong> {annualRevenue.toLocaleString()} DKK
          </p>
          <p>
            <strong>Category:</strong> {revenueCategory}
          </p>
          {commission && (
            <p>
              <strong>Agent Commission:</strong> {commission} DKK
            </p>
          )}
          {transactionPercent && (
            <p>
              <strong>Required Transaction Percent:</strong> {transactionPercent}%
            </p>
          )}
          {paymentOption && (
            <div className="mt-3 p-3 border rounded bg-light text-center">
              {paymentOption === "purchasing" ? (
                <h4 className="text-success">
                  Total Price: {fullPurchasePrice?.toLocaleString()} DKK
                </h4>
              ) : (
                <h4 className="text-danger">
                  Monthly Installment: {installment?.toLocaleString()} DKK
                </h4>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Results;
