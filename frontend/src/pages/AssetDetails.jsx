import { useEffect, useState } from "react";
import BrandLogo from "../components/BrandLogo";

import vitalchainLogo from "../assets/vitalchain-logo.png";
import { api } from "../api/api";

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
  Hash,
  Copy,
  Check,
  AlertTriangle,
  Ban,
} from "lucide-react";

function AssetDetails({
  asset,
  onBackToAssets,
  onDashboardClick,
  onPayNow,
}) {
  const [blockchainHash, setBlockchainHash] = useState("");
  const [hashCopied, setHashCopied] = useState(false);
  const [hashIsReal, setHashIsReal] = useState(false);
  const [operationMessage, setOperationMessage] = useState("");
  const [temperature, setTemperature] = useState("");
  const [liveAsset, setLiveAsset] = useState(null);
  const [revokeReason, setRevokeReason] = useState("");

  // Always hydrate the details page from the backend. This is especially
  // important for assets in transit: every new lifecycle event creates a
  // new block, so the displayed hash must be the latest on-chain hash.
  useEffect(() => {
    const id = asset?.assetId || asset?.id;
    if (!id) return;
    let cancelled = false;
    api.assets.getStatus(id).then((fresh) => {
      if (!cancelled) setLiveAsset(fresh);
    }).catch((error) => {
      if (!cancelled) {
        setLiveAsset({
          ...(asset || {}),
          _backendMissing: true,
          verified: false,
          verificationReason: error?.message || "Asset no longer exists in the backend."
        });
      }
    });
    return () => { cancelled = true; };
  }, [asset]);

  const runAssetEvent = async (eventType) => {
    try {
      const id = asset?.assetId || asset?.id;
      await api.assets.event(id, eventType, "VITALChain Hospital");
      const fresh = await api.assets.getStatus(id);
      setLiveAsset(fresh);
      setOperationMessage(`${eventType.replaceAll("_", " ")} recorded on blockchain.`);
      setTimeout(() => setOperationMessage(""), 3500);
      window.dispatchEvent(new CustomEvent("vitalchain:asset-updated", { detail: fresh }));
    } catch (error) {
      setOperationMessage(error.message || "Unable to record event.");
    }
  };

  const recordTemperature = async () => {
    const value = Number(temperature);
    if (!Number.isFinite(value)) return;
    try {
      const result = await api.assets.temperature(assetId, value);
      const fresh = await api.assets.getStatus(assetId);
      setLiveAsset(fresh);
      setOperationMessage(result.violation ? "Temperature violation recorded on blockchain." : "Temperature reading recorded.");
      setTemperature("");
    } catch (error) {
      setOperationMessage(error.message || "Unable to record temperature.");
    }
  };

  const revokeAsset = async () => {
    const reason = revokeReason.trim();
    if (!reason) {
      setOperationMessage("Enter a reason before revoking this asset.");
      return;
    }
    try {
      const fresh = await api.assets.revoke(assetId, reason);
      setLiveAsset(fresh);
      setOperationMessage("Asset revoked and revocation recorded on blockchain.");
      setRevokeReason("");
    } catch (error) {
      setOperationMessage(error.message || "Unable to revoke asset.");
    }
  };

  // =========================================================
  // HASH SOURCE
  // =========================================================
  //
  // If the backend already gave us a real on-chain hash
  // (asset.latestHash, from GET /assets/{id}/status), use
  // that — it's the actual hash stored in the blockchain
  // ledger, and it's the one that will flip on a tamper demo.
  //
  // Only fall back to a client-side generated fingerprint if
  // the asset hasn't been fetched from the backend yet (e.g.
  // still sitting in localStorage from before registration).
  //
  // =========================================================

  useEffect(() => {
    const sourceAsset = liveAsset || asset;
    if (!sourceAsset) return;

    if (sourceAsset.latestHash) {
      setBlockchainHash(sourceAsset.latestHash);
      setHashIsReal(true);
      return;
    }

    setHashIsReal(false);

    const record = JSON.stringify({
      assetId: sourceAsset.assetId || sourceAsset.id || "",
      name: sourceAsset.name || sourceAsset.fullName || "",
      batchNumber: sourceAsset.batchNumber || "",
      manufacturer: sourceAsset.manufacturer || "",
      quantity: sourceAsset.quantity || "",
      createdAt: sourceAsset.createdAt || "",
      paymentId: sourceAsset.paymentId || "",
    });

    const generateHash = async () => {
      try {
        const data = new TextEncoder().encode(record);
        const digest = await crypto.subtle.digest("SHA-256", data);

        const hex = Array.from(new Uint8Array(digest))
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");

        setBlockchainHash(`0x${hex}`);
      } catch (error) {
        console.error("Unable to generate asset hash:", error);
      }
    };

    generateHash();
  }, [asset, liveAsset]);

  const handleCopyHash = async () => {
    if (!blockchainHash) return;

    try {
      await navigator.clipboard.writeText(blockchainHash);
      setHashCopied(true);
      setTimeout(() => setHashCopied(false), 1800);
    } catch (error) {
      console.error("Unable to copy hash:", error);
    }
  };

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

  // Prefer the authoritative backend record when available.
  asset = liveAsset || asset;

  // Never render stale/local asset data after the backend says the asset
  // no longer exists. This prevents old demo records from appearing as
  // "Tampering Detected" after the database/chain has been reset.
  if (liveAsset?._backendMissing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <AlertTriangle size={28} className="text-slate-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Asset not found</h2>
          <p className="mt-2 text-sm text-slate-500">
            This asset no longer exists in the current SecureChain database.
          </p>
          <button
            type="button"
            onClick={onBackToAssets}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Assets
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
    "Unknown Vaccine";

  const shortName =
    asset.name ||
    vaccineName.split(" ")[0] ||
    "Vaccine";

  const assetId =
    asset.assetId ||
    asset.id ||
    "";

  const batchNumber =
    asset.batchNumber ||
    "";

  const manufacturer =
    asset.manufacturer ||
    "";

  const manufacturingAddress =
    asset.manufacturingAddress ||
    "";

  const manufacturingDate =
    asset.manufacturingDate ||
    "";

  const expiryDate =
    asset.expiryDate ||
    "";

  const storageRequirement =
    asset.storageRequirement ||
    asset.storage ||
    "";

  const quantity =
    asset.quantity ||
    "";

  const shipmentId =
    asset.shipmentId ||
    "";

  const origin =
    asset.origin ||
    "";

  const destination =
    asset.destination ||
    asset.destinationName ||
    asset.hospital ||
    "";

  const destinationName =
    asset.destinationName ||
    asset.hospital ||
    asset.destination ||
    "";

  const destinationAddress =
    asset.destinationAddress ||
    asset.deliveryAddress ||
    "";

  const transportMode =
    asset.transportMode ||
    "";

  const vehicleNumber =
    asset.vehicleNumber ||
    "";

  const driver =
    asset.driver ||
    "";

  const dispatchDate =
    asset.dispatchDate ||
    "";

  const expectedDelivery =
    asset.expectedDelivery ||
    "";

  // Status — dynamic, no longer hardcoded to "Delivered"
  const status = asset.status || "Registered";

  // Verified — reflects the backend's real blockchain check
  // (asset.verified from GET /assets/{id}/status). Defaults
  // to true only when we have no backend data at all yet, so
  // a purely local/unregistered asset doesn't show a false
  // negative before it's ever been checked.
  const verified = asset.verified !== undefined ? asset.verified : false;
  const verificationReason = asset.verificationReason || "";
  const revoked = Boolean(asset.revoked || status === "Revoked");

  // Pay Now handler
  const handlePayNow = () => {
    if (typeof onPayNow === "function") {
      onPayNow(asset);
      return;
    }

    window.alert(
      `Payment initiated for ${shortName} (Asset ID: ${assetId}).`
    );
  };

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

              {/* STATUS BADGE — dynamic */}

              <span className={`
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                ${revoked ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}
                font-semibold
                text-base
              `}>
                {revoked ? <Ban size={18} /> : <CheckCircle2 size={18} />}

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

              {revoked ? "Asset revoked" : verified ? "Verified on blockchain" : "Verification failed"}
            </div>

          </div>


          {/* CURRENT STATUS — dynamic */}

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
            VERIFICATION CHECKS
        ===================================================== */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Verification Checks</h2>
              <p className="text-sm text-slate-500 mt-1">Three independent checks used for the demo verification flow.</p>
            </div>
            {revoked && <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">REVOKED</span>}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["Vaccine exists", Boolean(assetId)],
              ["Blockchain record valid", verified],
              ["Vaccine available", !revoked && status !== "Administered"],
            ].map(([label, ok]) => (
              <div key={label} className={`rounded-xl border px-4 py-3 ${ok ? "border-emerald-100 bg-emerald-50" : "border-red-100 bg-red-50"}`}>
                <div className={`text-sm font-bold ${ok ? "text-emerald-700" : "text-red-700"}`}>{ok ? "✓" : "✕"} {label}</div>
              </div>
            ))}
          </div>
          {revoked && asset.revocation?.reason && (
            <div className="mt-4 flex gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <span><strong>Revocation reason:</strong> {asset.revocation.reason}</span>
            </div>
          )}
        </section>

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
                  {status}
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
                  value={status}
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
                  <span
                    className={`
                      w-2.5
                      h-2.5
                      rounded-full
                      ${asset.temperatureViolationCount ? "bg-red-500" : "bg-emerald-500"}
                    `}
                  ></span>

                  {asset.temperatureViolationCount ? "Violation Detected" : "Within Safe Range"}
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

              <div className="
                flex
                flex-col
                items-center
                text-center
              ">

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
                      className={verified ? "text-emerald-600" : "text-red-600"}
                    />

                    <span className={`
                      font-semibold
                      ${verified ? "text-emerald-600" : "text-red-600"}
                    `}>
                      {verified ? "Verified & Up To Date" : "Tampering Detected"}
                    </span>
                  </div>

                  {!verified && verificationReason && (
                    <p className="mt-2 text-xs text-red-500 leading-5">
                      {verificationReason}
                    </p>
                  )}

                  {/* BLOCKCHAIN RECORD HASH */}
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Hash size={16} className="text-indigo-600" />

                        <p className="
                          text-xs
                          font-semibold
                          text-slate-500
                          uppercase
                          tracking-wide
                        ">
                          {hashIsReal ? "On-Chain Block Hash" : "Blockchain Record Hash"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyHash}
                        disabled={!blockchainHash}
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-lg
                          px-2.5
                          py-1.5
                          text-xs
                          font-semibold
                          text-blue-600
                          hover:bg-blue-50
                          disabled:opacity-40
                          transition
                        "
                      >
                        {hashCopied ? (
                          <>
                            <Check size={14} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    <div className="
                      mt-2
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      px-3
                      py-2.5
                    ">
                      <p
                        className="
                          font-mono
                          text-xs
                          leading-5
                          text-slate-700
                          break-all
                        "
                        title={blockchainHash || "Generating hash..."}
                      >
                        {blockchainHash
                          ? `${blockchainHash.slice(0, 14)}...${blockchainHash.slice(-6)}`
                          : "Generating hash..."}
                      </p>
                    </div>

                    <p className="mt-2 text-[11px] leading-4 text-slate-400">
                      {hashIsReal
                        ? "Hash of the latest recorded event, from the SecureChain ledger."
                        : "SHA-256 fingerprint of this registered asset record (not yet on-chain)."}
                    </p>
                  </div>
                </div>

              </div>

            </section>


            {/* =================================================
                COLD-CHAIN VISUALIZATION
            ================================================= */}
            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center"><Thermometer size={23} className="text-cyan-600" /></div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Cold-Chain History</h2>
                    <p className="text-sm text-slate-500">Temperature readings recorded on-chain</p>
                  </div>
                </div>
                <div className={`rounded-full px-3 py-1.5 text-xs font-bold ${asset.temperatureViolationCount ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {asset.temperatureViolationCount ? `${asset.temperatureViolationCount} violation(s)` : "No violations"}
                </div>
              </div>
              {asset.temperatureReadings?.length ? (
                <div className="mt-6 space-y-3">
                  {asset.temperatureReadings.map((reading, index) => (
                    <div key={`${reading.timestamp}-${index}`} className="flex items-center gap-4">
                      <div className={`h-3 w-3 rounded-full shrink-0 ${reading.violation ? "bg-red-500" : "bg-emerald-500"}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className={`font-bold ${reading.violation ? "text-red-700" : "text-slate-800"}`}>{reading.temperature}°C</span>
                          <span className="text-xs text-slate-400">{reading.timestamp ? new Date(reading.timestamp * 1000).toLocaleString() : "Recorded"}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full rounded-full ${reading.violation ? "bg-red-500" : "bg-cyan-500"}`} style={{ width: `${Math.min(100, Math.max(8, ((reading.temperature + 70) / 150) * 100))}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">No temperature readings yet. Use the demo control below to record one.</div>
              )}
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
                    {asset.timeline?.length
                      ? `${asset.timeline.length} event${asset.timeline.length === 1 ? "" : "s"} recorded on-chain`
                      : "Delivery completed"}
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


              {/* TIMELINE — real chain events if available, else the
                  original 5-step demo sequence as a fallback */}

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

                {asset.timeline && asset.timeline.length > 0 ? (

                  asset.timeline.map((step, index) => (
                    <TimelineStep
                      key={index}
                      title={step.title}
                      subtitle={step.subtitle}
                      hash={step.hash}
                      blockIndex={step.blockIndex}
                      completed={step.completed}
                      current={index === asset.timeline.length - 1}
                    />
                  ))

                ) : (

                  <>
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
                      title={`Arrived at ${destinationName}`}
                      subtitle={`Completed • ${expectedDelivery}`}
                      completed
                    />

                    <TimelineStep
                      title="Delivered"
                      subtitle="Successfully delivered to destination"
                      completed
                      current
                    />
                  </>

                )}

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
                    {destinationName}
                  </h3>

                  {destinationAddress && (
                    <p className="
                      text-blue-100
                      mt-2
                      leading-relaxed
                    ">
                      {destinationAddress}
                    </p>
                  )}

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
                  {status}
                </span>

              </div>

            </section>

          </div>

        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Supply-chain controls</h3>
              <p className="text-sm text-slate-500">Every lifecycle change and cold-chain reading is written to the audit chain.</p>
            </div>
            {operationMessage && <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{operationMessage}</span>}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {["DISPATCHED", "IN_TRANSIT", "DELIVERED"].map((eventType) => (
              <button key={eventType} onClick={() => runAssetEvent(eventType)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                {eventType.replaceAll("_", " ")}
              </button>
            ))}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5">
              <input value={temperature} onChange={(e) => setTemperature(e.target.value)} type="number" step="0.1" placeholder="°C" className="w-20 bg-transparent px-2 py-1 text-sm outline-none" />
              <button onClick={recordTemperature} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">Log temperature</button>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-red-100 bg-red-50/50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600"><Ban size={22} /></div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">Vaccine Revocation</h3>
              <p className="text-sm text-slate-500 mt-1">Use this demo control for a recalled, expired, or cold-chain-compromised vaccine.</p>
              {!revoked ? (
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <input value={revokeReason} onChange={(e) => setRevokeReason(e.target.value)} placeholder="Reason, e.g. cold-chain violation" className="flex-1 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-100" />
                  <button onClick={revokeAsset} className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700">Revoke Vaccine</button>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-white border border-red-200 px-4 py-3 text-sm font-bold text-red-700">This vaccine is revoked. Patient verification will not allow registration.</div>
              )}
            </div>
          </div>
        </section>

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
  hash,
  blockIndex,
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
        {hash && (
          <p className="mt-1 font-mono text-[11px] text-slate-400 break-all">
            Block #{blockIndex} • {hash.slice(0, 16)}...{hash.slice(-8)}
          </p>
        )}

      </div>

    </div>
  );
}


export default AssetDetails;