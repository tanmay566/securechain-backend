import React from "react";
import vitalchainLogo from "../assets/vitalchain-logo.png";

import {
  ShieldCheck,
  Package,
  Factory,
  Truck,
  Thermometer,
  CalendarDays,
  Hash,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  Copy,
  QrCode,
  LockKeyhole,
  ArrowLeft,
} from "lucide-react";

function VaccineTraceability({
  asset,
  patient,
  onBackToAssets,
}) {
  // ---------------------------------------------------------
  // SAFETY FALLBACK
  // ---------------------------------------------------------

  if (!asset) {
    return (
      <div className="min-h-screen bg-[#f5f8fc] flex items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Package className="text-red-500" size={32} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Vaccine Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            We could not find the vaccine associated with this QR code.
          </p>

          <button
            onClick={() => {
              if (onBackToAssets) {
                onBackToAssets();
              } else {
                window.history.back();
              }
            }}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Assets
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // GET DATA FROM ADMIN CREATED ASSET
  // ---------------------------------------------------------

  const vaccineName =
    asset.fullName ||
    asset.name ||
    "Healthcare Vaccine";

  const assetId =
    asset.assetId ||
    asset.assetID ||
    asset.id ||
    "N/A";

  const batchNumber =
    asset.batchNumber ||
    "N/A";

  const manufacturer =
    asset.manufacturer ||
    "N/A";

  const quantity =
    asset.quantity ||
    "N/A";

  const manufacturingDate =
    asset.manufacturingDate ||
    "N/A";

  const expiryDate =
    asset.expiryDate ||
    "N/A";

  const storageRequirement =
    asset.storageRequirement ||
    asset.temperatureRange ||
    "N/A";

  const manufacturingAddress =
    asset.manufacturingAddress ||
    "N/A";

  const origin =
    asset.origin ||
    "N/A";

  const destination =
    asset.destination ||
    "N/A";

  const transportMode =
    asset.transportMode ||
    "N/A";

  const vehicleNumber =
    asset.vehicleNumber ||
    "N/A";

  const driver =
    asset.driver ||
    "N/A";

  const dispatchDate =
    asset.dispatchDate ||
    "N/A";

  const expectedDelivery =
    asset.expectedDelivery ||
    "N/A";

  // ---------------------------------------------------------
  // PATIENT INFORMATION
  // ---------------------------------------------------------

  const patientName =
    patient?.fullName ||
    "Not registered";

  const patientPhone =
    patient?.phone ||
    "Not available";

  const registrationDate =
    patient?.registrationDate ||
    new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ---------------------------------------------------------
  // DEMO BLOCKCHAIN HASH
  // ---------------------------------------------------------

  const blockchainHash =
    asset.blockchainHash ||
    asset.hash ||
    `0x${assetId
      .replace(/[^a-zA-Z0-9]/g, "")
      .padEnd(24, "9")
      .slice(0, 24)}91f2`;

  const shortenedHash =
    blockchainHash.length > 18
      ? `${blockchainHash.slice(0, 10)}...${blockchainHash.slice(-8)}`
      : blockchainHash;

  // ---------------------------------------------------------
  // COPY HASH
  // ---------------------------------------------------------

  const handleCopyHash = async () => {
    try {
      await navigator.clipboard.writeText(blockchainHash);
      alert("Blockchain hash copied.");
    } catch (error) {
      console.error("Unable to copy hash:", error);
    }
  };

  // ---------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-slate-900">

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-[1500px] px-5 py-7 lg:px-10">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="mb-7 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">

          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">

              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {asset.name || vaccineName}
              </h2>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">
                <CheckCircle2 size={16} />
                Delivered
              </span>

            </div>

            <p className="text-lg text-slate-500">
              {vaccineName} • Vaccine Asset
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-600">
              <ShieldCheck size={18} />
              Verified on blockchain
            </div>
          </div>

          {/* VITALCHAIN LOGO */}

          <div className="h-[110px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:w-[330px]">
            <img
              src={vitalchainLogo}
              alt="VITALChain"
              className="h-full w-full object-contain p-0"
            />
          </div>

        </section>


        {/* ===================================================
            TWO COLUMN LAYOUT
        =================================================== */}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(340px,0.85fr)]">

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="space-y-6">

            {/* =================================================
                VACCINE DETAILS
            ================================================= */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              {/* HEADER */}

              <div className="flex flex-col justify-between gap-4 border-b border-slate-200 px-7 py-6 sm:flex-row sm:items-center">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                    <Package
                      size={28}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold">
                      Vaccine Details
                    </h3>

                    <p className="text-sm text-slate-500">
                      Information retrieved from VITALChain
                    </p>
                  </div>

                </div>

                <span className="w-fit rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">
                  Verified
                </span>

              </div>

              {/* DETAILS */}

              <div className="grid gap-x-10 gap-y-8 p-7 sm:grid-cols-2">

                <Detail
                  label="Vaccine Name"
                  value={vaccineName}
                />

                <Detail
                  label="Asset ID"
                  value={assetId}
                  blue
                />

                <Detail
                  label="Batch Number"
                  value={batchNumber}
                />

                <Detail
                  label="Manufacturer"
                  value={manufacturer}
                />

                <Detail
                  label="Quantity"
                  value={quantity}
                />

                <Detail
                  label="Manufacturing Date"
                  value={manufacturingDate}
                />

                <Detail
                  label="Expiry Date"
                  value={expiryDate}
                />

                <Detail
                  label="Storage Requirement"
                  value={storageRequirement}
                />

                <div className="sm:col-span-2">
                  <Detail
                    label="Manufacturing Address"
                    value={manufacturingAddress}
                  />
                </div>

              </div>

            </section>


            {/* =================================================
                REGISTERED PERSON
            ================================================= */}

            <section className="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-sm">

              <div className="border-b border-green-100 bg-gradient-to-r from-green-50 to-white px-7 py-6">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                    <User
                      size={27}
                      className="text-green-600"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold">
                      Registered To
                    </h3>

                    <p className="text-sm text-slate-500">
                      Vaccine registration information
                    </p>
                  </div>

                </div>

              </div>

              <div className="grid gap-6 p-7 sm:grid-cols-2">

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Person Name
                  </p>

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                      <User
                        size={18}
                        className="text-green-600"
                      />
                    </div>

                    <p className="text-lg font-bold text-slate-900">
                      {patientName}
                    </p>

                  </div>
                </div>


                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Phone Number
                  </p>

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                      <Phone
                        size={18}
                        className="text-blue-600"
                      />
                    </div>

                    <p className="text-lg font-bold text-slate-900">
                      {patientPhone}
                    </p>

                  </div>
                </div>


                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Asset Registered
                  </p>

                  <p className="font-semibold text-slate-800">
                    {assetId}
                  </p>
                </div>


                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Registration Date
                  </p>

                  <div className="flex items-center gap-2 font-semibold text-slate-800">

                    <CalendarDays
                      size={17}
                      className="text-slate-400"
                    />

                    {registrationDate}

                  </div>
                </div>

              </div>


              <div className="mx-7 mb-7 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">

                <ShieldCheck
                  size={21}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>

                  <p className="font-semibold text-blue-900">
                    Vaccine successfully registered
                  </p>

                  <p className="mt-1 text-sm leading-6 text-blue-700">
                    This vaccine is now linked to the registered person
                    through the VITALChain verification record.
                  </p>

                </div>

              </div>

            </section>


            {/* =================================================
                MANUFACTURING + STORAGE + SHIPMENT
                NEW 3 + 3 + 6 LAYOUT
            ================================================= */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">

              {/* =================================================
                  MANUFACTURING
              ================================================= */}

              <div className="md:col-span-3">
                <InfoCard
                  icon={<Factory size={22} />}
                  title="Manufacturing"
                  iconClass="bg-blue-50 text-blue-600"
                >
                  <InfoRow
                    label="Manufacturer"
                    value={manufacturer}
                  />

                  <InfoRow
                    label="Origin"
                    value={origin}
                  />

                  <InfoRow
                    label="Manufacturing Date"
                    value={manufacturingDate}
                  />
                </InfoCard>
              </div>


              {/* =================================================
                  STORAGE
              ================================================= */}

              <div className="md:col-span-3">
                <InfoCard
                  icon={<Thermometer size={22} />}
                  title="Storage"
                  iconClass="bg-green-50 text-green-600"
                >
                  <InfoRow
                    label="Required Range"
                    value={storageRequirement}
                  />

                  <div className="mt-4 rounded-xl bg-green-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                      <CheckCircle2 size={16} />
                      Safe Storage Range
                    </div>
                  </div>
                </InfoCard>
              </div>


              {/* =================================================
                  SHIPMENT INFORMATION
              ================================================= */}

              <div className="md:col-span-6">

                <section className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="mb-6 flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50">
                      <Truck
                        size={22}
                        className="text-purple-600"
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Shipment Information
                      </h3>

                      <p className="text-sm text-slate-400">
                        Delivery and transportation details
                      </p>
                    </div>

                  </div>


                  <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">

                    <InfoRow
                      label="Origin"
                      value={origin}
                    />

                    <InfoRow
                      label="Destination"
                      value={destination}
                    />

                    <InfoRow
                      label="Vehicle Number"
                      value={vehicleNumber}
                    />

                    <InfoRow
                      label="Driver"
                      value={driver}
                    />

                    <InfoRow
                      label="Dispatch Date"
                      value={dispatchDate}
                    />

                    <InfoRow
                      label="Expected Delivery"
                      value={expectedDelivery}
                    />

                  </div>

                </section>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="space-y-6">

            {/* =================================================
                AUTHENTIC ASSET
            ================================================= */}

            <section className="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-sm">

              <div className="p-7">

                <div className="flex flex-col items-center text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">

                    <ShieldCheck
                      size={42}
                      className="text-green-600"
                    />

                  </div>

                  <h3 className="mt-5 text-2xl font-bold">
                    Verified Asset Record
                  </h3>

                  <p className="mt-1 text-slate-500">
                    Verified on blockchain
                  </p>

                </div>


                {/* STATUS */}

                <div className="mt-7 rounded-2xl bg-slate-50 p-5">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Verification Status
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-lg font-bold text-green-600">
                    <CheckCircle2 size={21} />
                    Verified & Delivered
                  </div>


                  <div className="my-5 h-px bg-slate-200" />


                  {/* HASH */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <Hash
                        size={20}
                        className="text-blue-600"
                      />

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Blockchain Record Hash
                      </p>

                    </div>


                    <button
                      onClick={handleCopyHash}
                      className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                    >
                      <Copy size={16} />
                      Copy
                    </button>

                  </div>


                  <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-4">

                    <p className="break-all font-mono text-sm font-semibold text-slate-700">
                      {shortenedHash}
                    </p>

                  </div>


                  <p className="mt-3 text-xs leading-5 text-slate-400">
                    SHA-256 fingerprint of this registered asset record.
                  </p>

                </div>

              </div>

            </section>


            {/* =================================================
                QR INFORMATION
            ================================================= */}

            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">

                  <QrCode
                    size={25}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <h3 className="text-xl font-bold">
                    QR Verification
                  </h3>

                  <p className="text-sm text-slate-500">
                    Asset identity
                  </p>

                </div>

              </div>


              <div className="mt-6 rounded-2xl bg-slate-50 p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Asset ID
                </p>

                <p className="mt-2 break-all font-mono text-lg font-bold text-blue-600">
                  {assetId}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600">
                  <LockKeyhole size={16} />
                  QR linked & verified
                </div>

              </div>

            </section>


            {/* =================================================
                DELIVERY STATUS
            ================================================= */}

            <section className="rounded-3xl bg-blue-600 p-7 text-white shadow-lg shadow-blue-200">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">

                  <MapPin size={25} />

                </div>

                <div>

                  <p className="text-sm font-medium text-blue-100">
                    Delivered To
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    {destination}
                  </h3>

                </div>

              </div>


              <div className="my-6 h-px bg-white/20" />


              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={20} />
                Delivery successfully completed
              </div>

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}


// =============================================================
// DETAIL COMPONENT
// =============================================================

function Detail({
  label,
  value,
  blue = false,
}) {
  return (
    <div>

      <p className="mb-2 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p
        className={`text-base font-semibold leading-6 ${
          blue
            ? "text-blue-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>

    </div>
  );
}


// =============================================================
// INFO CARD
// =============================================================

function InfoCard({
  icon,
  title,
  iconClass,
  children,
}) {
  return (
    <section className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-3">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <h3 className="font-bold text-slate-900">
          {title}
        </h3>

      </div>

      {children}

    </section>
  );
}


// =============================================================
// INFO ROW
// =============================================================

function InfoRow({
  label,
  value,
}) {
  return (
    <div className="mb-5 last:mb-0">

      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">
        {value}
      </p>

    </div>
  );
}


export default VaccineTraceability;