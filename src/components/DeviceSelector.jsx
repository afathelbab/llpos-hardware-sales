import React from "react";

const DeviceSelector = ({ devices, selectedDevices, updateQuantity }) => {
  return (
    <div className="mb-4">
      <h5 className="text-dark">Select Devices and Quantities</h5>
      {Object.keys(devices).map((device) => (
        <div
          key={device}
          className="d-flex justify-content-between align-items-center border p-2 rounded bg-light my-2"
        >
          <span className="fw-bold text-dark">{device}</span>
          <input
            type="number"
            className="form-control w-25"
            min={0}
            placeholder="0"
            value={selectedDevices[device] || ""}
            onChange={(e) => updateQuantity(device, Number(e.target.value))}
          />
        </div>
      ))}
    </div>
  );
};

export default DeviceSelector;
