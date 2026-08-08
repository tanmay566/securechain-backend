import BrandLogo from "../components/BrandLogo";
import vitalchainLogo from "../assets/vitalchain-logo.png";
import {
  ArrowLeft,
  Bell,
  Grid2X2,
  ShieldCheck,
  Package,
  Thermometer,
  Truck,
  MapPin,
  CheckCircle2,
} from "lucide-react";

function AssetDetails({ asset, onBackToAssets, onDashboardClick }) {
  // Safety fallback
  if (!asset) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            No Asset Selected
          </h2>
          <p className="text-slate-500 mb-5">
            Please go back to the Assets page and select an asset.
          </p>
          <button
            onClick={onBackToAssets}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            ← Back to Assets
          </button>
        </div>
      </div>
    );
  }

  // Dynamic values with safe fallbacks
  const vaccineName =
    asset.fullName ||
    asset.vaccineName ||
    asset.name ||
    "COVISHIELD";
  const shortName =
    asset.name ||
    vaccineName.split(" ")[0] ||
    "Vaccine";
  const assetId =
    asset.assetId ||
    asset.id ||
    "VC-IND-2026-000981";
  const batchNumber =
    asset.batchNumber ||
    "DEMO-COV-260501";
  const manufacturer = asset.manufacturer || "";
  const quantity = asset.quantity || "";
  const manufacturingDate = asset.manufacturingDate || "";
  const expiryDate = asset.expiryDate || "";
  const storageRequirement = asset.storageRequirement || "";
  const manufacturingAddress = asset.manufacturingAddress || "";
  const shipmentId = asset.shipmentId || "";
  const transportMode = asset.transportMode || "";
  const origin = asset.origin || "";
  const destination = asset.destination || "";
  const vehicleNumber = asset.vehicleNumber || "";
  const driver = asset.driver || "";
  const dispatchDate = asset.dispatchDate || "";
  const expectedDelivery = asset.expectedDelivery || "";

  // Dynamic status — no longer hardcoded to "Delivered"
  const status = asset.status || "Registered";
  const verified = asset.verified !== undefined ? asset.verified : true;
  const latestHash = asset.latestHash || null;
  const timeline = asset.timeline || [];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="h-[68px] bg-white border-b border-slate-200 flex items-center px-6">

        <div className="w-[270px] h-[64px] shrink-0 flex items-center">
          <img
            src={vitalchainLogo}
            alt="VITALChain"
            className="h-[166px] w-auto object-contain"
          />
        </div>

        <div className="ml-auto flex items-center gap-5 shrink-0">

          <button className="text-slate-500 hover:text-blue-600 transition hover:scale-110">
            <Bell size={21} />
          </button>

          <button className="text-slate-500 hover:text-blue-600 transition hover:scale-110">
            <Grid2X2 size={20} />
          </button>

          <button
            className="
              w-10
              h-10
              rounded-full
              bg-blue-600
              text-white
              flex
              items-center
              justify-center
              font-bold
              text-base
              shadow-sm
              hover:scale-105
              transition
            "
          >
            R
          </button>

        </div>

      </header>


      {/* =========================================================
          PAGE
      ========================================================= */}

      <main className="w-full px-6 md:px-8 lg:px-12 py-8">


        {/* BACK */}

        <button
          onClick={onBackToAssets}
          className="
            flex
            items-center
            gap-2
            text-blue-600
            hover:text-blue-800
            font-semibold
            text-base
            mb-5
            transition
          "
        >
          <ArrowLeft size={19} />
          Back to Assets
        </button>


        {/* =====================================================
            PAGE TITLE
        ===================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <div className="flex items-center gap-3 flex-wrap">

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                {shortName}
              </h1>

              {/* STATUS BADGE — now dynamic */}

              <span className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-emerald-50
                text-emerald-700
                font-semibold
                text-base
              ">
                <CheckCircle2 size={18} />
                {status}
              </span>

            </div>

            <p className="text-lg text-slate-500 mt-2">
              {vaccineName} • Vaccine Asset
            </p>

            <div className={`
              flex
              items-center
              gap-2
              mt-3
              text-sm
              font-semibold
              ${verified ? "text-emerald-600" : "text-red-600"}
            `}>
              <ShieldCheck size={17} />
              {verified ? "Verified on blockchain" : "Verification failed"}
            </div>

          </div>


          {/* CURRENT STATUS — now dynamic */}

          <div className="
            flex
            items-center
            gap-3
            bg-white
            border
            border-emerald-200
            rounded-2xl
            px-5
            py-4
            shadow-sm
          ">

            <div className="
              w-11
              h-11
              rounded-xl
              bg-emerald-50
              flex
              items-center
              justify-center
            ">
              <CheckCircle2
                className="text-emerald-600"
                size={24}
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Current Shipment Status
              </p>
              <p className="text-lg font-bold text-emerald-600">
                {status}
              </p>
            </div>

          </div>

        </div>


        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">


          {/* ===================================================
              LEFT SIDE
          =================================================== */}

          <div className="xl:col-span-2 space-y-6">


            {/* =================================================
                VACCINE DETAILS
            ================================================= */}

            <section className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              shadow-sm
              p-7
            ">

              <div className="flex items-center justify-between mb-7">

                <div className="flex items-center gap-3">

                  <div className="
                    w-11
                    h-11
                    rounded-xl
                    bg-blue-50
                    flex
                    items-center
                    justify-center
                  ">
                    <Package
                      size={23}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Vaccine Details
                    </h2>
                    <p className="text-sm text-slate-500">
                      Registered asset information
                    </p>
                  </div>

                </div>

                {/* status badge — now dynamic */}
                <span className="
                  px-3
                  py-1.5
                  rounded-lg
                  bg-emerald-50
                  text-emerald-700
                  text-sm
                  font-semibold
                ">
                  {status}
                </span>

              </div>


              {/* DETAILS */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

                <DetailItem label="Vaccine Name" value={vaccineName} />
                <DetailItem label="Asset ID" value={assetId} />
                <DetailItem label="Batch Number" value={batchNumber} />
                <DetailItem label="Manufacturer" value={manufacturer} />
                <DetailItem label="Quantity" value={quantity} />
                <DetailItem label="Manufacturing Date" value={manufacturingDate} />
                <DetailItem label="Expiry Date" value={expiryDate} />
                <DetailItem label="Storage Requirement" value={storageRequirement} />

                {/* status — now dynamic */}
                <DetailItem
                  label="Asset Status"
                  value={status}
                  valueClass="text-emerald-600"
                />

              </div>


              {/* MANUFACTURING ADDRESS */}

              <div className="mt-7 pt-6 border-t border-slate-100">
                <p className="text-sm font-semibold text-slate-500 mb-2">
                  Manufacturing Address
                </p>
                <p className="text-base font-medium text-slate-800 leading-relaxed">
                  {manufacturingAddress}
                </p>
              </div>

            </section>


            {/* =================================================
                TEMPERATURE
            ================================================= */}

            <section className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              shadow-sm
              p-7
            ">

              <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-3">

                  <div className="
                    w-11
                    h-11
                    rounded-xl
                    bg-cyan-50
                    flex
                    items-center
                    justify-center
                  ">
                    <Thermometer
                      size={23}
                      className="text-cyan-600"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Temperature Monitoring
                    </h2>
                    <p className="text-sm text-slate-500">
                      Cold-chain storage verification
                    </p>
                  </div>

                </div>

                <span className="
                  flex
                  items-center
                  gap-2
                  text-emerald-600
                  font-semibold
                  text-sm
                ">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Within Safe Range
                </span>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
                  <p className="text-sm text-slate-500 font-medium">
                    Safe Temperature Range
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {storageRequirement}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-5">
                  <p className="text-sm text-emerald-700 font-medium">
                    Temperature Status
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle2 size={24} className="text-emerald-600" />
                    <p className="text-xl font-bold text-emerald-700">
                      Safe
                    </p>
                  </div>
                </div>

              </div>

            </section>


            {/* =================================================
                SHIPMENT INFORMATION
            ================================================= */}

            <section className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              shadow-sm
              p-7
            ">

              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Truck size={23} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Shipment Information
                  </h2>
                  <p className="text-sm text-slate-500">
                    Delivery and transportation details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <DetailItem label="Shipment ID" value={shipmentId} />
                <DetailItem label="Transport Mode" value={transportMode} />
                <DetailItem label="Origin" value={origin} />
                <DetailItem label="Destination" value={destination} />
                <DetailItem label="Vehicle Number" value={vehicleNumber} />
                <DetailItem label="Driver" value={driver} />
                <DetailItem label="Dispatch Date" value={dispatchDate} />
                <DetailItem label="Expected Delivery" value={expectedDelivery} />
              </div>

            </section>

          </div>


          {/* ===================================================
              RIGHT SIDE
          =================================================== */}

          <div className="space-y-6">


            {/* =================================================
                AUTHENTIC ASSET / VERIFICATION + HASH
            ================================================= */}

            <section className={`
              bg-white
              border
              rounded-2xl
              shadow-sm
              p-7
              ${verified ? "border-emerald-200" : "border-red-200"}
            `}>

              <div className="flex flex-col items-center text-center">

                <div className={`
                  w-16
                  h-16
                  rounded-full
                  flex
                  items-center
                  justify-center
                  mb-4
                  ${verified ? "bg-emerald-50" : "bg-red-50"}
                `}>
                  <ShieldCheck
                    size={34}
                    className={verified ? "text-emerald-600" : "text-red-600"}
                  />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {verified ? "Authentic Asset" : "Verification Failed"}
                </h2>

                <p className="text-slate-500 mt-1">
                  {verified ? "Verified on blockchain" : "Data may have been altered"}
                </p>

                <div className="w-full mt-6 bg-slate-50 rounded-xl p-4 text-left">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Verification Status
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle2
                      size={18}
                      className={verified ? "text-emerald-600" : "text-red-600"}
                    />
                    <span className={`font-semibold ${verified ? "text-emerald-600" : "text-red-600"}`}>
                      {verified ? "Verified & Up To Date" : "Tampering Detected"}
                    </span>
                  </div>
                </div>

                {/* LATEST BLOCK HASH */}
                {latestHash && (
                  <div className="w-full mt-4 bg-slate-50 rounded-xl p-4 text-left">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Latest Block Hash
                    </p>
                    <p className="font-mono text-xs text-slate-700 mt-2 break-all">
                      {latestHash}
                    </p>
                  </div>
                )}

              </div>

            </section>


            {/* =================================================
                SHIPMENT TRACKING — now dynamic timeline
            ================================================= */}

            <section className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              shadow-sm
              p-7
            ">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Truck size={23} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Shipment Tracking
                  </h2>
                  <p className="text-sm text-slate-500">
                    {timeline.length} event{timeline.length === 1 ? "" : "s"} recorded on-chain
                  </p>
                </div>
              </div>

              {/* TIMELINE — built from real blockchain event history */}

              <div className="relative ml-2">

                {timeline.length > 0 && (
                  <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-emerald-200"></div>
                )}

                {timeline.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No events recorded yet.
                  </p>
                ) : (
                  timeline.map((step, index) => (
                    <TimelineStep
                      key={index}
                      title={step.title}
                      subtitle={step.subtitle}
                      completed={step.completed}
                      current={index === timeline.length - 1}
                    />
                  ))
                )}

              </div>

            </section>


            {/* =================================================
                DESTINATION
            ================================================= */}

            {destination && (
              <section className="
                bg-blue-600
                rounded-2xl
                shadow-lg
                shadow-blue-600/20
                p-7
                text-white
              ">

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <MapPin size={23} />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm font-medium">
                      Destination
                    </p>
                    <h3 className="text-xl font-bold mt-1">
                      {destination}
                    </h3>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/20 flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span className="font-semibold">
                    {status}
                  </span>
                </div>

              </section>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}


/* =============================================================
   REUSABLE DETAIL ITEM
============================================================= */

function DetailItem({
  label,
  value,
  valueClass = "text-slate-800",
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-500 mb-1.5">
        {label}
      </p>
      <p className={`text-base font-semibold leading-relaxed ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}


/* =============================================================
   TIMELINE COMPONENT
============================================================= */

function TimelineStep({
  title,
  subtitle,
  completed = false,
  current = false,
}) {
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">

      <div
        className={`
          relative
          z-10
          w-6
          h-6
          rounded-full
          flex
          items-center
          justify-center
          shrink-0
          ${
            completed
              ? current
                ? "bg-emerald-600 ring-4 ring-emerald-100"
                : "bg-emerald-500"
              : "bg-slate-200"
          }
        `}
      >
        {completed && (
          <CheckCircle2 size={16} className="text-white" />
        )}
      </div>

      <div className="pt-0.5">
        <p className={`font-semibold text-base ${current ? "text-emerald-700" : "text-slate-800"}`}>
          {title}
        </p>
        <p className="text-sm text-slate-500 mt-1">
          {subtitle}
        </p>
      </div>

    </div>
  );
}


export default AssetDetails;