import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DeviceSelector from "./components/DeviceSelector";
import PaymentModelSelector from "./components/PaymentModelSelector";
import Results from "./components/Results";

const devices = {
  "Dobbelt Screen": { cost: 3800, price: 8000 },
  "Single Screen": { cost: 3400, price: 6500 },
  M20: { cost: 1400, price: 2500 },
  Pengeskuffe: { cost: 330, price: 1000 },
};

const roundUpToNearest50 = (amount) => Math.ceil(amount / 50) * 50;

const revenueClasses = [
  { name: "Nova", min: 0, max: 400000, baseCommission: 250 },
  { name: "Vega", min: 400001, max: 800000, baseCommission: 500 },
  { name: "Zen", min: 800001, max: 1200000, baseCommission: 1000 },
  { name: "Alfa", min: 1200001, max: 6000000, baseCommission: 2000 },
];

export default function SalesApp() {
  const [selectedDevices, setSelectedDevices] = useState({});
  const [downPayment, setDownPayment] = useState(1000);
  const [installment, setInstallment] = useState(null);
  const [paymentOption, setPaymentOption] = useState("purchasing");
  const [fullPurchasePrice, setFullPurchasePrice] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [modifiedRevenue, setModifiedRevenue] = useState(null);
  const [annualRevenue, setAnnualRevenue] = useState(null);
  const [revenueCategory, setRevenueCategory] = useState("");
  const [commission, setCommission] = useState(null);
  const [transactionPercent, setTransactionPercent] = useState(null);

  const updateQuantity = (device, quantity) => {
    const validQuantity = Math.max(0, Math.floor(quantity));
    setSelectedDevices((prev) => ({
      ...prev,
      [device]: validQuantity > 0 ? validQuantity : undefined,
    }));
  };

  const calculateTotalPrice = () => {
    return Object.entries(selectedDevices).reduce(
      (total, [device, quantity]) => {
        if (quantity) {
          total += devices[device].price * quantity;
        }
        return total;
      },
      0
    );
  };

  const calculateInstallment = (withDownPayment) => {
    const totalPrice = calculateTotalPrice();
    if (totalPrice === 0) return;

    const financingPrice = withDownPayment
      ? totalPrice * 1.35
      : totalPrice * 1.45;
    const paymentToFinance = withDownPayment
      ? financingPrice - downPayment
      : financingPrice;
    const monthlyInstallment = roundUpToNearest50(paymentToFinance / 24);

    setInstallment(monthlyInstallment);
    setFullPurchasePrice(null);
    setPaymentOption(
      withDownPayment ? "With Down Payment" : "Without Down Payment"
    );
  };

  const showFullPurchasePrice = () => {
    const totalPrice = calculateTotalPrice();
    if (totalPrice === 0) return;

    setFullPurchasePrice(totalPrice);
    setInstallment(null);
    setPaymentOption("Purchasing Model");
  };

  const evaluateRevenueCategory = () => {
    if (!monthlyRevenue || isNaN(parseFloat(monthlyRevenue))) {
      alert("Please enter a valid Monthly Revenue.");
      return;
    }
    const modified = parseFloat(monthlyRevenue) * 0.8;
    const annual = modified * 12;
    setModifiedRevenue(modified);
    setAnnualRevenue(annual);

    const category = revenueClasses.find(
      (cls) => modified >= cls.min && modified <= cls.max
    );
    if (category) {
      setRevenueCategory(category.name);

      // Calculate commission based on position within range
      const position =
        (modified - category.min) / (category.max - category.min);
      let calculatedCommission =
        category.baseCommission + position * category.baseCommission;

      // Calculate total price and financing price
      const totalPrice = calculateTotalPrice();
      let financingPrice = 0;
      let calculatedInstallment = null;

      if (paymentOption === "financing_downpayment") {
        financingPrice = totalPrice * 1.35;
        calculatedCommission += financingPrice * 0.15;
        calculatedInstallment = roundUpToNearest50(
          (financingPrice - downPayment) / 24
        );
      } else if (paymentOption === "financing_no_downpayment") {
        financingPrice = totalPrice * 1.45;
        calculatedCommission += financingPrice * 0.1;
        calculatedInstallment = roundUpToNearest50(financingPrice / 24);
      } else if (paymentOption === "purchasing") {
        calculatedCommission += totalPrice * 0.2;
      }

      setFullPurchasePrice(totalPrice);
      setInstallment(calculatedInstallment);
      setCommission(calculatedCommission.toFixed(2));

      let transactionPercent = calculateTransactionPercent(annual);
      setTransactionPercent(transactionPercent);
    } else {
      setRevenueCategory("Outside Range");
      setCommission(null);
      setFullPurchasePrice(null);
      setInstallment(null);
      setTransactionPercent(null);
    }
  };

  // Calculate the Transaction Percent that Gives us Total Profit of 15,000 DKK per Customer at the 3rd Year
  const calculateTransactionPercent = (modifiedAnnualRevenue) => {
    const costPerTransaction = 0.006; // B11 (0.6%)
    const discountRate = 0.15; // B25 (15%)
    const softPOSCost = 1200; // B14 (1200 DKK)
    const setupCost = 100; // Opsætning cost (B14)
  
    const retentionRates = [0.95, 0.86, 0.75]; // B29, B31, B33
    let transactionPercent = 0.007; // Initial guess (0.7%)
    let maxIterations = 1000; // Prevent infinite loop
    let iterationCount = 0;
  
    // Calculate Hardware Cost (sum of selected device costs)
    const hardwareCost = Object.entries(selectedDevices).reduce(
      (total, [device, quantity]) => total + (devices[device].cost * (quantity || 0)),
      0
    );
  
    // Determine Initial Payment based on Payment Model
    let initialPayment = 0;
    if (paymentOption === "purchasing") {
      initialPayment = calculateTotalPrice();
    } else if (paymentOption === "financing_downpayment") {
      initialPayment = downPayment;
    }
  
    // Calculate CPA (Customer Acquisition Cost)
    const CPA = initialPayment - (commission || 0) - hardwareCost - setupCost;
  
    while (transactionPercent < 0.1 && iterationCount < maxIterations) {
      let expectedProfit = 0;
      let previousYearProfit = 0;
  
      for (let year = 0; year < 3; year++) {
        let annualProfit =
          (transactionPercent - costPerTransaction) *
          modifiedAnnualRevenue *
          retentionRates[year];
  
        annualProfit /= Math.pow(1 + discountRate, year + 1); // Discounting
  
        if (year === 0) {
          annualProfit += CPA; // Include CPA only in the first year
          previousYearProfit = annualProfit;
        } else {
          annualProfit += previousYearProfit;
          previousYearProfit = annualProfit;
        }
  
        annualProfit -= softPOSCost;
  
        if (year === 2) {
          expectedProfit = annualProfit; // Third-year profit check
        }
      }
  
      if (expectedProfit >= 15000) {
        return (transactionPercent * 100 + 0.2).toFixed(2); // Add 0.2% for negotiation margin
      }
  
      transactionPercent += 0.0001; // Increment step size for precision
      iterationCount++;
    }
  
    return "Not Found"; // If no valid percentage found
  };
  
  return (
    <div className="container-fluid my-5">
      <div className="row">
        {/* Left Side: Sales Calculator */}
        <div className="col-md-6 col-12">
          <div className="p-4 bg-white rounded shadow-lg">
            <div className="mb-3 text-center">
              <img
                src="/logo.png"
                alt="Company Logo"
                className="img-fluid"
                style={{ maxHeight: "80px" }}
              />
            </div>
            <h2 className="text-primary text-center mb-4">
              LLPOS Hardware Sales
            </h2>
            <label className="fw-bold text-dark">
              Enter Monthly Revenue (DKK)
            </label>
            <input
              type="number"
              className="form-control mb-2"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(e.target.value)}
            />
            <DeviceSelector
              devices={devices}
              selectedDevices={selectedDevices}
              updateQuantity={updateQuantity}
            />
            <PaymentModelSelector
              paymentOption={paymentOption}
              setPaymentOption={setPaymentOption}
              downPayment={downPayment}
              setDownPayment={setDownPayment}
            />
          </div>
        </div>
        {/* Right Side: Evaluation */}
        <div className="col-md-6 col-12">
          <Results
            modifiedRevenue={modifiedRevenue}
            annualRevenue={annualRevenue}
            revenueCategory={revenueCategory}
            commission={commission}
            transactionPercent={transactionPercent}
            paymentOption={paymentOption}
            fullPurchasePrice={fullPurchasePrice}
            installment={installment}
            evaluateRevenueCategory={evaluateRevenueCategory}
          />
        </div>
      </div>
    </div>
  );
}
