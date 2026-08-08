
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

  const manufacturer =
    asset.manufacturer ||
    "Serum Institute of India Pvt. Ltd.";

  const manufacturingAddress =
    asset.manufacturingAddress ||
    "212/2, Hadapsar, Off Soli Poonawalla Road, Pune – 411028, Maharashtra, India";

  const manufacturingDate =
    asset.manufacturingDate ||
    "01 May 2026";

  const expiryDate =
    asset.expiryDate ||
    "31 October 2026";

  const storageRequirement =
    asset.storageRequirement ||
    asset.storage ||
    "2°C – 8°C";

  const quantity =
    asset.quantity ||
    "500 Vials";

  const shipmentId =
    asset.shipmentId ||
    "VTC-SHP-2026-00142";

  const origin =
    asset.origin ||
    "Serum Institute of India, Pune, Maharashtra";

  const destination =
    asset.destination ||
    "AIIMS New Delhi, Ansari Nagar, New Delhi – 110029";

  const transportMode =
    asset.transportMode ||
    "Temperature-controlled road transport";

  const vehicleNumber =
    asset.vehicleNumber ||
    "MH-12-AB-4582";

  const driver =
    asset.driver ||
    "Ramesh Kumar";

  const dispatchDate =
    asset.dispatchDate ||
    "05 May 2026 — 08:30 AM";

  const expectedDelivery =
    asset.expectedDelivery ||
    "07 May 2026 — 02:00 PM";

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="w-full h-[68px] bg-white border-b border-slate-200 flex items-center px-6">

        {/* LOGO */}

<div className="w-[270px] h-[64px] shrink-0 flex items-center">
  <img
    src={vitalchainLogo}
    alt="VITALChain"
    className="h-[166px] w-auto object-contain"
  />
</div>

        {/* NAVIGATION */}

        <nav className="flex items-center gap-2 ml-8">

          {/* Dashboard */}

          <button
            onClick={onDashboardClick}
            className="
              px-5 py-2.5
              rounded-full
              text-base
              font-medium
              text-slate-600
              hover:bg-slate-100
              hover:text-blue-600
              transition-all
              duration-200
            "
          >
            Dashboard
          </button>


          {/* Assets */}

          <button
            onClick={onBackToAssets}
            className="
              px-5 py-2.5
              rounded-full
              bg-blue-50
              text-blue-600
              text-base
              font-semibold
              transition
            "
          >
            Assets
          </button>

        </nav>


        {/* SEARCH */}

        <div className="flex-1 ml-8 mr-8">

          <div className="relative w-full max-w-[700px]">

            <Package
              size={20}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Search assets, shipments..."
              className="
                w-full
                h-11
                pl-12
                pr-4
                bg-white
                border
                border-slate-200
                rounded-xl
                text-base
                text-slate-700
                placeholder:text-slate-400
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/10
                transition
              "
            />

          </div>

        </div>


        {/* RIGHT SIDE */}

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

              {/* DELIVERED BADGE */}

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

                Delivered
              </span>

            </div>


            <p className="text-lg text-slate-500 mt-2">
              {vaccineName} • Vaccine Asset
            </p>


            <div className="
              flex
              items-center
              gap-2
              mt-3
              text-sm
              text-emerald-600
              font-semibold
            ">
              <ShieldCheck size={17} />

              Verified on blockchain
            </div>

          </div>


          {/* CURRENT STATUS */}

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
                Successfully Delivered
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


                <span className="
                  px-3
                  py-1.5
                  rounded-lg
                  bg-emerald-50
                  text-emerald-700
                  text-sm
                  font-semibold
                ">
                  Delivered
                </span>

              </div>


              {/* DETAILS */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

                <DetailItem
                  label="Vaccine Name"
                  value={vaccineName}
                />

                <DetailItem
                  label="Asset ID"
                  value={assetId}
                />

                <DetailItem
                  label="Batch Number"
                  value={batchNumber}
                />

                <DetailItem
                  label="Manufacturer"
                  value={manufacturer}
                />

                <DetailItem
                  label="Quantity"
                  value={quantity}
                />

                <DetailItem
                  label="Manufacturing Date"
                  value={manufacturingDate}
                />

                <DetailItem
                  label="Expiry Date"
                  value={expiryDate}
                />

                <DetailItem
                  label="Storage Requirement"
                  value={storageRequirement}
                />

                <DetailItem
                  label="Asset Status"
                  value="Delivered"
                  valueClass="text-emerald-600"
                />

              </div>


              {/* MANUFACTURING ADDRESS */}

              <div className="mt-7 pt-6 border-t border-slate-100">

                <p className="
                  text-sm
                  font-semibold
                  text-slate-500
                  mb-2
                ">
                  Manufacturing Address
                </p>

                <p className="
                  text-base
                  font-medium
                  text-slate-800
                  leading-relaxed
                ">
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
                  <span className="
                    w-2.5
                    h-2.5
                    rounded-full
                    bg-emerald-500
                  "></span>

                  Within Safe Range
                </span>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* SAFE RANGE */}

                <div className="
                  rounded-xl
                  bg-slate-50
                  border
                  border-slate-200
                  p-5
                ">

                  <p className="
                    text-sm
                    text-slate-500
                    font-medium
                  ">
                    Safe Temperature Range
                  </p>

                  <p className="
                    text-3xl
                    font-bold
                    text-slate-900
                    mt-2
                  ">
                    {storageRequirement}
                  </p>

                </div>


                {/* STATUS */}

                <div className="
                  rounded-xl
                  bg-emerald-50
                  border
                  border-emerald-100
                  p-5
                ">

                  <p className="
                    text-sm
                    text-emerald-700
                    font-medium
                  ">
                    Temperature Status
                  </p>

                  <div className="flex items-center gap-2 mt-2">

                    <CheckCircle2
                      size={24}
                      className="text-emerald-600"
                    />

                    <p className="
                      text-xl
                      font-bold
                      text-emerald-700
                    ">
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

                <div className="
                  w-11
                  h-11
                  rounded-xl
                  bg-indigo-50
                  flex
                  items-center
                  justify-center
                ">
                  <Truck
                    size={23}
                    className="text-indigo-600"
                  />
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


              <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-x-10
                gap-y-6
              ">

                <DetailItem
                  label="Shipment ID"
                  value={shipmentId}
                />

                <DetailItem
                  label="Transport Mode"
                  value={transportMode}
                />

                <DetailItem
                  label="Origin"
                  value={origin}
                />

                <DetailItem
                  label="Destination"
                  value={destination}
                />

                <DetailItem
                  label="Vehicle Number"
                  value={vehicleNumber}
                />

                <DetailItem
                  label="Driver"
                  value={driver}
                />

                <DetailItem
                  label="Dispatch Date"
                  value={dispatchDate}
                />

                <DetailItem
                  label="Expected Delivery"
                  value={expectedDelivery}
                />

              </div>

            </section>

          </div>


          {/* ===================================================
              RIGHT SIDE
          =================================================== */}

          <div className="space-y-6">


            {/* =================================================
                AUTHENTIC ASSET
            ================================================= */}

            <section className="
              bg-white
              border
              border-emerald-200
              rounded-2xl
              shadow-sm
              p-7
            ">

              <div className="
                flex
                flex-col
                items-center
                text-center
              ">

                <div className="
                  w-16
                  h-16
                  rounded-full
                  bg-emerald-50
                  flex
                  items-center
                  justify-center
                  mb-4
                ">
                  <ShieldCheck
                    size={34}
                    className="text-emerald-600"
                  />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  Authentic Asset
                </h2>

                <p className="text-slate-500 mt-1">
                  Verified on blockchain
                </p>


                <div className="
                  w-full
                  mt-6
                  bg-slate-50
                  rounded-xl
                  p-4
                  text-left
                ">

                  <p className="
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                    tracking-wide
                  ">
                    Verification Status
                  </p>

                  <div className="flex items-center gap-2 mt-2">

                    <CheckCircle2
                      size={18}
                      className="text-emerald-600"
                    />

                    <span className="
                      font-semibold
                      text-emerald-600
                    ">
                      Verified & Delivered
                    </span>

                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                SHIPMENT TRACKING
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

                <div className="
                  w-11
                  h-11
                  rounded-xl
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                ">
                  <Truck
                    size={23}
                    className="text-blue-600"
                  />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Shipment Tracking
                  </h2>

                  <p className="text-sm text-slate-500">
                    Delivery completed
                  </p>

                </div>

              </div>


              {/* PROGRESS */}

              <div className="mb-7">

                <div className="flex justify-between mb-2">

                  <span className="
                    text-sm
                    font-medium
                    text-slate-600
                  ">
                    Shipment Progress
                  </span>

                  <span className="
                    text-sm
                    font-bold
                    text-emerald-600
                  ">
                    100% Completed
                  </span>

                </div>


                <div className="
                  w-full
                  h-2
                  bg-emerald-100
                  rounded-full
                  overflow-hidden
                ">
                  <div className="
                    w-full
                    h-full
                    bg-emerald-500
                    rounded-full
                  "></div>
                </div>

              </div>


              {/* TIMELINE */}

              <div className="relative ml-2">

                {/* LINE */}

                <div className="
                  absolute
                  left-[11px]
                  top-3
                  bottom-3
                  w-0.5
                  bg-emerald-200
                "></div>


                <TimelineStep
                  title="Shipment Registered"
                  subtitle="Completed • 05 May 2026, 08:30 AM"
                  completed
                />


                <TimelineStep
                  title="Dispatched from Serum Institute"
                  subtitle="Completed • 05 May 2026"
                  completed
                />


                <TimelineStep
                  title="In Transit"
                  subtitle="Completed • Temperature-controlled transport"
                  completed
                />


                <TimelineStep
                  title="Arrived at AIIMS New Delhi"
                  subtitle="Completed • 07 May 2026, 02:00 PM"
                  completed
                />


                <TimelineStep
                  title="Delivered"
                  subtitle="Successfully delivered to destination"
                  completed
                  current
                />

              </div>

            </section>


            {/* =================================================
                DESTINATION
            ================================================= */}

            <section className="
              bg-blue-600
              rounded-2xl
              shadow-lg
              shadow-blue-600/20
              p-7
              text-white
            ">

              <div className="flex items-start gap-4">

                <div className="
                  w-11
                  h-11
                  rounded-xl
                  bg-white/15
                  flex
                  items-center
                  justify-center
                  shrink-0
                ">
                  <MapPin size={23} />
                </div>

                <div>

                  <p className="
                    text-blue-100
                    text-sm
                    font-medium
                  ">
                    Delivered To
                  </p>

                  <h3 className="
                    text-xl
                    font-bold
                    mt-1
                  ">
                    AIIMS New Delhi
                  </h3>

                  <p className="
                    text-blue-100
                    mt-2
                    leading-relaxed
                  ">
                    Ansari Nagar, New Delhi – 110029
                  </p>

                </div>

              </div>


              <div className="
                mt-6
                pt-5
                border-t
                border-white/20
                flex
                items-center
                gap-2
              ">

                <CheckCircle2 size={18} />

                <span className="font-semibold">
                  Delivery successfully completed
                </span>

              </div>

            </section>

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

      <p className="
        text-sm
        font-semibold
        text-slate-500
        mb-1.5
      ">
        {label}
      </p>

      <p className={`
        text-base
        font-semibold
        leading-relaxed
        ${valueClass}
      `}>
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
    <div className="
      relative
      flex
      gap-4
      pb-6
      last:pb-0
    ">

      {/* CIRCLE */}

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
          <CheckCircle2
            size={16}
            className="text-white"
          />
        )}

      </div>


      {/* TEXT */}

      <div className="pt-0.5">

        <p
          className={`
            font-semibold
            text-base
            ${
              current
                ? "text-emerald-700"
                : "text-slate-800"
            }
          `}
        >
          {title}
        </p>

        <p className="
          text-sm
          text-slate-500
          mt-1
        ">
          {subtitle}
        </p>

      </div>

    </div>
  );
}


export default AssetDetails;