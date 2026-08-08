import { useState } from "react";
import BrandLogo from "../components/BrandLogo";
import vitalchainLogo from "../assets/vitalchain-logo.png";
import {
  ArrowLeft,
  Package,
  Thermometer,
  Truck,
  Plus,
  CheckCircle2,
} from "lucide-react";


function NewAsset({
  onCancel,
  onCreateAsset,
}) {

  const [formData, setFormData] = useState({

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

    origin: "",
    destination: "",

    transportMode:
      "Temperature-controlled road transport",

    vehicleNumber: "",
    driver: "",

    dispatchDate: "",
    expectedDelivery: "",

    status: "Delivered",

  });


  // =========================================================
  // INPUT HANDLER
  // =========================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =========================================================
  // CREATE ASSET
  // =========================================================

  const handleSubmit = (e) => {

    e.preventDefault();


    if (
      !formData.name ||
      !formData.assetId ||
      !formData.manufacturer ||
      !formData.destination
    ) {

      alert(
        "Please fill Asset Name, Asset ID, Manufacturer and Destination."
      );

      return;
    }


    const newAsset = {

      ...formData,

      // Used by the details page
      temperatureRange:
        formData.storageRequirement,

      createdAt:
        new Date().toISOString(),

    };


    onCreateAsset(newAsset);

  };


  return (

    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="h-[68px] bg-white border-b border-slate-200 flex items-center px-6">

        {/* Logo */}

       <div className="w-[270px] h-[64px] shrink-0 flex items-center">
         <img
           src={vitalchainLogo}
           alt="VITALChain"
           className="h-[166px] w-auto object-contain"
         />
       </div>

        {/* Navigation */}

        <nav className="flex items-center gap-2">

          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full text-slate-600 hover:bg-slate-100 font-medium transition"
          >
            Dashboard
          </button>

          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full bg-blue-50 text-blue-600 font-semibold"
          >
            Assets
          </button>

        </nav>


        <div className="ml-auto flex items-center gap-5">

          <button className="text-slate-500">
            🔔
          </button>

          <button className="text-slate-500">
            ▦
          </button>

          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            R
          </div>

        </div>

      </header>


      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <main className="w-full px-8 lg:px-12 py-8">


        {/* Back */}

        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 mb-5"
        >

          <ArrowLeft size={18} />

          Back to Assets

        </button>


        {/* Heading */}

        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-4xl font-bold text-slate-900">
              Add New Asset
            </h1>

            <p className="text-lg text-slate-500 mt-2">
              Register a new healthcare asset and add it to the VITALChain tracking system.
            </p>

          </div>


          <div className="flex gap-3">

            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700"
            >
              Create Asset
            </button>

          </div>

        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >


          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7">

            <div className="flex items-center gap-3 mb-7">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <Package
                  size={23}
                  className="text-blue-600"
                />
              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Basic Asset Information
                </h2>

                <p className="text-sm text-slate-500">
                  Enter the basic information of the healthcare asset.
                </p>

              </div>

            </div>


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


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Asset Type
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 text-base"
                >

                  <option>Vaccines</option>
                  <option>Diagnostic Equipment</option>
                  <option>Medical Devices</option>
                  <option>Pharmaceuticals</option>

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
              STORAGE
          ================================================= */}

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7">

            <div className="flex items-center gap-3 mb-7">

              <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center">

                <Thermometer
                  size={23}
                  className="text-cyan-600"
                />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Storage & Temperature Constraints
                </h2>

                <p className="text-sm text-slate-500">
                  Define the safe storage conditions.
                </p>

              </div>

            </div>


            <Input
              label="Temperature Constraint"
              name="storageRequirement"
              value={formData.storageRequirement}
              onChange={handleChange}
              placeholder="Example: 2°C – 8°C"
            />


            <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">

              <CheckCircle2 size={18} />

              <span className="font-medium">
                Temperature range will be monitored during shipment.
              </span>

            </div>

          </section>


          {/* =================================================
              SHIPMENT INFORMATION
          ================================================= */}

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7">

            <div className="flex items-center gap-3 mb-7">

              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">

                <Truck
                  size={23}
                  className="text-indigo-600"
                />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Shipment Information
                </h2>

                <p className="text-sm text-slate-500">
                  These details will automatically appear on the asset tracking page.
                </p>

              </div>

            </div>


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


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Current Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 text-base"
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


          {/* Bottom button */}

          

        </form>

      </main>

    </div>
  );
}


/* =============================================================
   INPUT COMPONENT
============================================================= */

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
        className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base"
      />

    </div>

  );
}


export default NewAsset;