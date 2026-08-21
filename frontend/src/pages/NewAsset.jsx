import { useState } from "react";
import SecurePayment from "../components/SecurePayment";
import vitalchainLogo from "../assets/vitalchain-logo.png";

import {
  ArrowLeft,
  Package,
  Thermometer,
  Truck,
  CheckCircle2,
  Search,
  Bell,
  Grid2X2,
} from "lucide-react";

function NewAsset({
  onCancel,
  onCreateAsset,
  onPayNow,
  onDashboardClick,
}) {
  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({
    // Basic Asset Information
    name: "",
    fullName: "",
    assetId: "",
    batchNumber: "",
    category: "Vaccines",
    manufacturer: "",
    manufacturingAddress: "",
    manufacturingDate: "",
    expiryDate: "",
    storageRequirement: "2°C – 8°C",
    quantity: "",

    // Shipment Information
    origin: "",
    destination: "",
    transportMode: "Temperature-controlled road transport",
    vehicleNumber: "",
    driver: "",
    dispatchDate: "",
    expectedDelivery: "",
    status: "Delivered",
  });

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Please enter Asset Name.");
      return false;
    }

    if (!formData.assetId.trim()) {
      alert("Please enter Asset ID.");
      return false;
    }

    if (!formData.manufacturer.trim()) {
      alert("Please enter Manufacturer.");
      return false;
    }

    if (!formData.destination.trim()) {
      alert("Please enter Destination.");
      return false;
    }

    return true;
  };

  // =========================================================
  // CREATE ASSET OBJECT
  // =========================================================

  const buildAsset = () => {
    return {
      ...formData,

      temperatureRange: formData.storageRequirement,

      createdAt: new Date().toISOString(),
    };
  };


  // Keep the latest form data available to every page in the payment flow.
  const saveAssetForPaymentFlow = (asset) => {
    try {
      const serialized = JSON.stringify(asset);

      localStorage.setItem("vitalchainAsset", serialized);
      localStorage.setItem("selectedAsset", serialized);
      localStorage.setItem("vitalchainSelectedAsset", serialized);

      window.dispatchEvent(
        new CustomEvent("vitalchain:asset-updated", {
          detail: asset,
        })
      );
    } catch (error) {
      console.warn("Unable to save asset data:", error);
    }
  };

  // =========================================================
  // CREATE ASSET
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newAsset = buildAsset();

    saveAssetForPaymentFlow(newAsset);

    console.log("Creating asset:", newAsset);

    if (typeof onCreateAsset === "function") {
      onCreateAsset(newAsset);
    }
  };

  // =========================================================
  // PAY NOW
  // =========================================================

  const handlePayNow = () => {
    if (!validateForm()) {
      return;
    }

    const newAsset = buildAsset();

    saveAssetForPaymentFlow(newAsset);

    console.log("Opening payment page for:", newAsset);

    if (typeof onPayNow === "function") {
      onPayNow(newAsset);
      return;
    }

    alert(
      "Payment page is not connected yet. Please connect onPayNow in App.jsx."
    );
  };

  // =========================================================
  // DASHBOARD NAVIGATION
  // =========================================================

  const handleDashboardNavigation = () => {
    if (typeof onDashboardClick === "function") {
      onDashboardClick();
      return;
    }

    // Fallback if App.jsx doesn't provide the function.
    // This prevents the page from crashing.
    console.warn("onDashboardClick is not connected in App.jsx.");
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="w-full h-[88px] bg-white border-b border-slate-200 flex items-center px-6 lg:px-10">

        {/* =================================================
            VITALCHAIN LOGO
        ================================================= */}

        <div className="w-[330px] shrink-0 flex items-center">
          <img
            src={vitalchainLogo}
            alt="VITALChain"
            className="h-[72px] w-auto object-contain"
          />
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="flex items-center gap-2 shrink-0">

          {/* Dashboard */}
          <button
            type="button"
            onClick={handleDashboardNavigation}
            className="
              px-7
              py-3
              rounded-full
              text-[17px]
              font-medium
              text-slate-700
              hover:bg-blue-50
              hover:text-blue-600
              transition
            "
          >
            Dashboard
          </button>

          {/* Assets - ACTIVE */}
          <button
            type="button"
            className="
              px-7
              py-3
              rounded-full
              bg-blue-50
              text-blue-600
              text-[17px]
              font-semibold
            "
          >
            Assets
          </button>

        </nav>

        {/* =================================================
            SEARCH BAR
        ================================================= */}

        <div className="flex-1 mx-8 min-w-0">

          <div className="relative">

            <Search
              size={23}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-slate-400
                pointer-events-none
              "
            />

            <input
              type="text"
              placeholder="Search assets, shipments..."
              className="
                w-full
                h-[56px]
                pl-14
                pr-5
                rounded-2xl
                border
                border-slate-200
                bg-white
                text-[17px]
                text-slate-700
                placeholder:text-slate-400
                outline-none
                focus:border-blue-400
                focus:ring-4
                focus:ring-blue-100
                transition
              "
            />

          </div>

        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="flex items-center gap-7 shrink-0">

          {/* Notification */}
          <button
            type="button"
            aria-label="Notifications"
            className="
              text-slate-500
              hover:text-blue-600
              transition
            "
          >
            <Bell size={25} />
          </button>

          {/* Grid / Apps */}
          <button
            type="button"
            aria-label="Applications"
            className="
              text-slate-500
              hover:text-blue-600
              transition
            "
          >
            <Grid2X2 size={24} />
          </button>

          {/* Profile */}
          <button
            type="button"
            aria-label="Profile"
            className="
              w-[50px]
              h-[50px]
              rounded-full
              bg-blue-600
              text-white
              text-lg
              font-semibold
              flex
              items-center
              justify-center
              shadow-sm
            "
          >
            R
          </button>

        </div>

      </header>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <main className="w-full px-8 lg:px-12 py-8">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={onCancel}
          className="
            flex
            items-center
            gap-2
            text-blue-600
            font-medium
            hover:text-blue-800
            transition
            mb-5
          "
        >
          <ArrowLeft size={18} />
          Back to Assets
        </button>

        {/* =================================================
            PAGE HEADING
        ================================================= */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-slate-900">
            Add New Asset
          </h1>

          <p className="text-lg text-slate-500 mt-2">
            Register a new healthcare asset and add it to the
            VITALChain tracking system.
          </p>

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          id="new-asset-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* =================================================
              BASIC ASSET INFORMATION
          ================================================= */}

          <section
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              shadow-sm
              p-7
            "
          >

            <SectionHeader
              icon={
                <Package
                  size={23}
                  className="text-blue-600"
                />
              }
              iconBg="bg-blue-50"
              title="Basic Asset Information"
              description="Enter the basic information of the healthcare asset."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Input
                label="Asset Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: COVISHIELD"
              />

              <Input
                label="Full Vaccine / Asset Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Example: COVISHIELD (ChAdOx1 nCoV-19)"
              />

              <Input
                label="Asset ID"
                name="assetId"
                value={formData.assetId}
                onChange={handleChange}
                placeholder="Example: VC-IND-2026-000981"
              />

              <Input
                label="Batch Number"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                placeholder="Example: DEMO-COV-260501"
              />

              {/* Asset Type */}
              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Asset Type
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    text-base
                  "
                >
                  <option value="Vaccines">
                    Vaccines
                  </option>

                  <option value="Diagnostic Equipment">
                    Diagnostic Equipment
                  </option>

                  <option value="Medical Devices">
                    Medical Devices
                  </option>

                  <option value="Pharmaceuticals">
                    Pharmaceuticals
                  </option>
                </select>

              </div>

              <Input
                label="Manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="Manufacturer / organization"
              />

              <Input
                label="Manufacturing Date"
                name="manufacturingDate"
                value={formData.manufacturingDate}
                onChange={handleChange}
                type="date"
              />

              <Input
                label="Expiry Date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                type="date"
              />

              <Input
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Example: 500 Vials"
              />

              <div className="md:col-span-2">

                <Input
                  label="Manufacturing Address"
                  name="manufacturingAddress"
                  value={formData.manufacturingAddress}
                  onChange={handleChange}
                  placeholder="Complete manufacturing address"
                />

              </div>

            </div>

          </section>

          {/* =================================================
              STORAGE & TEMPERATURE
          ================================================= */}

          <section
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              shadow-sm
              p-7
            "
          >

            <SectionHeader
              icon={
                <Thermometer
                  size={23}
                  className="text-cyan-600"
                />
              }
              iconBg="bg-cyan-50"
              title="Storage & Temperature Constraints"
              description="Define the safe storage conditions."
            />

            <Input
              label="Temperature Constraint"
              name="storageRequirement"
              value={formData.storageRequirement}
              onChange={handleChange}
              placeholder="Example: 2°C – 8°C"
            />

            <div
              className="
                mt-4
                flex
                items-center
                gap-2
                px-4
                py-3
                rounded-xl
                bg-emerald-50
                border
                border-emerald-100
                text-emerald-700
              "
            >

              <CheckCircle2 size={18} />

              <span className="font-medium">
                Temperature range will be monitored during shipment.
              </span>

            </div>

          </section>

          {/* =================================================
              SHIPMENT INFORMATION
          ================================================= */}

          <section
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              shadow-sm
              p-7
            "
          >

            <SectionHeader
              icon={
                <Truck
                  size={23}
                  className="text-indigo-600"
                />
              }
              iconBg="bg-indigo-50"
              title="Shipment Information"
              description="These details will automatically appear on the asset tracking page."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Input
                label="Origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="Origin facility / organization"
              />

              <Input
                label="Destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Destination hospital / facility"
              />

              <Input
                label="Transport Mode"
                name="transportMode"
                value={formData.transportMode}
                onChange={handleChange}
                placeholder="Example: Temperature-controlled road transport"
              />

              <Input
                label="Vehicle Number"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="Example: MH-12-AB-4582"
              />

              <Input
                label="Driver"
                name="driver"
                value={formData.driver}
                onChange={handleChange}
                placeholder="Driver name"
              />

              {/* Current Status */}
              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Current Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="
                    w-full
                    h-12
                    px-4
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    text-base
                  "
                >

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="In Transit">
                    In Transit
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                </select>

              </div>

              <Input
                label="Dispatch Date & Time"
                name="dispatchDate"
                value={formData.dispatchDate}
                onChange={handleChange}
                placeholder="Example: 05 May 2026 — 08:30 AM"
              />

              <Input
                label="Expected Delivery"
                name="expectedDelivery"
                value={formData.expectedDelivery}
                onChange={handleChange}
                placeholder="Example: 07 May 2026 — 02:00 PM"
              />

            </div>

          </section>

          {/* =================================================
              SECURE PAYMENT
          ================================================= */}

          <SecurePayment
            assetName={formData.name || "Enter Asset Name"}
            assetId={formData.assetId || "Enter Asset ID"}
            amount="19,999"
            onPayNow={handlePayNow}
          />

        </form>

      </main>

    </div>
  );
}


// =============================================================
// SECTION HEADER
// =============================================================

function SectionHeader({
  icon,
  iconBg,
  title,
  description,
}) {
  return (
    <div className="flex items-center gap-3 mb-7">

      <div
        className={`
          w-11
          h-11
          rounded-xl
          ${iconBg}
          flex
          items-center
          justify-center
        `}
      >
        {icon}
      </div>

      <div>

        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

        <p className="text-sm text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}


// =============================================================
// INPUT COMPONENT
// =============================================================

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          h-12
          px-4
          rounded-xl
          border
          border-slate-300
          bg-white
          outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          transition
          text-base
        "
      />

    </div>
  );
}

export default NewAsset;