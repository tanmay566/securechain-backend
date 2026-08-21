import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  Copy,
  Grid2X2,
  Info,
  LockKeyhole,
  Search,
  WalletCards,
} from "lucide-react";

import vitalchainLogo from "../assets/vitalchain-logo.png";

function Send({
  selectedAsset,
  onBack,
  onDashboardClick,
  onAssetsClick,
  onConfirmOrder,
}) {
  // =========================================================
  // ASSET INFORMATION
  // =========================================================

  const assetName =
    selectedAsset?.name || "Demo Vaccine";

  const assetId =
    selectedAsset?.assetId ||
    selectedAsset?.assetID ||
    selectedAsset?.id ||
    "ASSET-ID-001";

  const manufacturer =
    selectedAsset?.manufacturer ||
    "Serum Institute of India";

  const quantity =
    selectedAsset?.quantity || "100 Vials";

  const recipientAddress =
    selectedAsset?.recipientAddress ||
    "0x7A3B...91F2";

  // =========================================================
  // PAYMENT DATA
  // =========================================================

  const [amount, setAmount] = useState(
    String(selectedAsset?.amount || "₹ 19,999")
  );

  const [recipient, setRecipient] = useState(
    selectedAsset?.recipientAddress || ""
  );

  const [connected, setConnected] = useState(false);

  const [authorized, setAuthorized] = useState(false);

  const [completed, setCompleted] = useState(false);

  // =========================================================
  // PAYMENT CALCULATION
  // =========================================================

  const numericAmount = useMemo(() => {
    const cleaned = String(amount).replace(/,/g, "");

    const value = Number(cleaned);

    return Number.isFinite(value) && value > 0
      ? value
      : 19999;
  }, [amount]);

  // Demo exchange rate
  const usdcAmount = (numericAmount / 84.55).toFixed(2);

  const networkFee = "0.02";

  const totalUsdc = (
    Number(usdcAmount) + Number(networkFee)
  ).toFixed(2);

  // Payment authorization is valid for 30 minutes from the
  // current local time. The date/time is generated automatically.
  const validUntil = useMemo(() => {
    const deadline = new Date(Date.now() + 30 * 60 * 1000);

    return deadline.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  // =========================================================
  // COPY ADDRESS
  // =========================================================

  const copyAddress = async (address) => {
    try {
      await navigator.clipboard.writeText(address);

      alert("Wallet address copied.");
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // =========================================================
  // CONNECT WALLET
  // =========================================================

  const handleConnectWallet = () => {
    setConnected(true);
  };

  // =========================================================
  // AUTHORIZE PAYMENT
  // =========================================================

  const handleAuthorizePayment = () => {
    if (!connected) {
      setConnected(true);
      return;
    }

    setAuthorized(true);

    // Open Confirm Order through the existing App.jsx navigation.
    // No React Router is required. All information entered/selected
    // earlier in the application is passed forward unchanged.
    if (typeof onConfirmOrder === "function") {
      onConfirmOrder({
        selectedAsset,
        assetName,
        assetId,
        manufacturer,
        quantity,
        amount: numericAmount,
        numericAmount,
        usdcAmount,
        networkFee,
        totalUsdc,
        recipient: recipient || recipientAddress,
        recipientAddress: recipient || recipientAddress,
        network: "Polygon Amoy Testnet",
        paymentToken: "USDC (Polygon Amoy)",
        orderId: "VTC-ORD-2026-0081",
        validUntil,
        paymentStatus: "authorized",
      });
    } else {
      console.warn(
        "Send.jsx: onConfirmOrder was not provided by App.jsx."
      );
    }
  };

  // =========================================================
  // CONFIRM PAYMENT
  // =========================================================

  const handleConfirmPayment = () => {
    if (!connected) {
      setConnected(true);
      return;
    }

    if (!authorized) {
      setAuthorized(true);
      return;
    }

    setCompleted(true);
  };

  // =========================================================
  // MAIN BUTTON
  // =========================================================

  const handlePaymentAction = () => {
    if (!connected) {
      handleConnectWallet();
      return;
    }

    if (!authorized) {
      handleAuthorizePayment();
      return;
    }

    handleConfirmPayment();
  };

  // =========================================================
  // BUTTON TEXT
  // =========================================================

  const getButtonText = () => {
    if (completed) {
      return "Payment Confirmed ✓";
    }

    if (!connected) {
      return "Connect Wallet & Continue";
    }

    if (!authorized) {
      return "Authorize Payment & Continue";
    }

    return "Confirm Payment";
  };

  // =========================================================
  // CURRENT STEP
  // =========================================================

  const currentStep = completed
    ? 3
    : authorized
      ? 3
      : connected
        ? 2
        : 1;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">

      {/* =====================================================
          HEADER
      ===================================================== */}

      {/* =====================================================
          HEADER — SAME STYLE AS WALLET / ASSETS
      ===================================================== */}

      <header className="h-[88px] bg-white border-b border-slate-200 flex items-center px-6 lg:px-10">

        {/* VITALChain LOGO */}

        <div className="w-[330px] shrink-0 flex items-center">
          <img
            src={vitalchainLogo}
            alt="VITALChain"
            className="h-[72px] w-auto object-contain"
          />
        </div>

        {/* MAIN NAVIGATION */}

        <nav className="flex items-center gap-2 shrink-0">

          <button
            type="button"
            onClick={() => {
              if (typeof onDashboardClick === "function") {
                onDashboardClick();
              }
            }}
            className="px-7 py-3 rounded-full text-[17px] font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => {
              if (typeof onAssetsClick === "function") {
                onAssetsClick();
              }
            }}
            className="px-7 py-3 rounded-full text-[17px] font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            Assets
          </button>

        </nav>

        {/* SEARCH BAR */}

        <div className="flex-1 mx-8 min-w-0">

          <div className="relative">

            <Search
              size={23}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />

            <input
              type="text"
              placeholder="Search assets, shipments..."
              className="w-full h-[56px] pl-14 pr-5 rounded-2xl border border-slate-200 bg-white text-[17px] text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition"
            />

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center gap-7 shrink-0">

          {/* NOTIFICATIONS */}

          <button
            type="button"
            aria-label="Notifications"
            className="text-slate-500 hover:text-blue-600 transition"
          >
            <Bell size={25} />
          </button>

          {/* APPLICATIONS */}

          <button
            type="button"
            aria-label="Applications"
            className="text-slate-500 hover:text-blue-600 transition"
          >
            <Grid2X2 size={24} />
          </button>

          {/* PROFILE */}

          <button
            type="button"
            aria-label="Profile"
            className="w-[50px] h-[50px] rounded-full bg-blue-600 text-white text-lg font-semibold flex items-center justify-center shadow-sm"
          >
            R
          </button>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-[1500px] mx-auto px-5 md:px-8 py-5">

        {/* ===================================================
            TWO COLUMN LAYOUT
        =================================================== */}

        {!connected && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 xl:items-stretch">

          {/* =================================================
              LEFT — PAYMENT DETAILS
          ================================================= */}

          <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-full min-h-0 flex flex-col xl:self-stretch">

            {/* TITLE */}

            <div className="px-5 py-4 border-b border-slate-200 bg-white">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <WalletCards size={19} />
                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    Payment Details
                  </h2>

                  <p className="text-sm text-slate-500">
                    Verify the healthcare asset before payment.
                  </p>

                </div>

              </div>

            </div>

            {/* DETAILS */}

            <div className="p-5">

              <div className="space-y-2">

                {/* ORDER ID */}

                <DetailRow
                  icon="▣"
                  label="Order ID"
                  value="VTC-ORD-2026-0081"
                />

                {/* ASSET */}

                <DetailRow
                  icon="◉"
                  label="Asset / Vaccine"
                  value={assetName}
                />

                {/* ASSET ID */}

                <DetailRow
                  icon="◇"
                  label="Asset ID"
                  value={assetId}
                />

                {/* MANUFACTURER */}

                <DetailRow
                  icon="▥"
                  label="Manufacturer"
                  value={manufacturer}
                />

                {/* QUANTITY */}

                <DetailRow
                  icon="▣"
                  label="Quantity"
                  value={quantity}
                />

                {/* AMOUNT — PREMIUM PAYMENT CARD */}

                <div className="w-full rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50 shadow-sm overflow-hidden">

                  <div className="flex items-center justify-between gap-4 px-4 py-3">

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
                        <span className="text-xl font-bold">₹</span>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.08em]">
                          Payment Amount
                        </p>

                        <p className="text-sm font-semibold text-slate-800 truncate">
                          Healthcare asset payment
                        </p>
                      </div>

                    </div>

                    <div className="flex items-baseline gap-0 shrink-0">

                      <span className="text-[22px] font-bold text-blue-600 leading-none mr-1">
                        
                      </span>

                      <input
                        type="text"
                        value={amount}
                        onChange={(event) =>
                          setAmount(event.target.value)
                        }
                        aria-label="Payment amount"
                        className="w-[105px] bg-transparent outline-none text-left text-[25px] leading-none font-extrabold tracking-tight text-slate-900 p-0 m-0"
                      />

                    </div>

                  </div>

                  <div className="flex items-center justify-end px-4 pb-2.5 -mt-1">
                    <span className="text-[11px] font-medium text-slate-500">
                      ≈ {usdcAmount} USDC
                    </span>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />

                </div>

                {/* PAYMENT TOKEN */}

                <DetailRow
                  icon="$"
                  label="Payment Token"
                  value="USDC (Polygon Amoy)"
                />

                {/* RECIPIENT */}

                <div className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-3.5 py-3 hover:border-blue-200 hover:bg-blue-50/30 transition">

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <span className="text-sm">♙</span>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                        Recipient
                      </p>
                      <p className="text-sm font-medium text-slate-700">
                        Wallet Address
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-2 max-w-[260px]">

                    <input
                      type="text"
                      value={recipient}
                      onChange={(event) =>
                        setRecipient(event.target.value)
                      }
                      placeholder={recipientAddress}
                      className="w-[175px] text-right text-xs font-semibold text-slate-800 bg-transparent outline-none"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        copyAddress(
                          recipient || recipientAddress
                        )
                      }
                      className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-center"
                      title="Copy recipient address"
                    >
                      <Copy size={15} />
                    </button>

                  </div>

                </div>

                {/* NETWORK */}

                <DetailRow
                  icon="●"
                  label="Network"
                  value="Polygon Amoy Testnet"
                  purple
                />

                {/* VALID UNTIL */}

                <DetailRow
                  icon="◷"
                  label="Valid Until"
                  value={`${validUntil} IST`}
                  last
                />

              </div>

              {/* X402 INFO */}

              <div className="mt-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-3.5 shadow-sm">

                <div className="flex items-start gap-3">

                  <div className="w-7 h-7 rounded-full bg-white text-blue-600 flex items-center justify-center shrink-0">
                    <Info size={15} />
                  </div>

                  <div>

                    <p className="text-xs font-bold text-blue-700">
                      What is x402?
                    </p>

                    <p className="text-[11px] leading-5 text-blue-600 mt-1">
                      x402 is an HTTP-native payment protocol.
                      When payment is required, the server responds
                      with HTTP 402 and payment details. After payment
                      authorization, the request can be completed.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              RIGHT — PAY WITH WALLET
          ================================================= */}

          <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-full min-h-0 flex flex-col xl:self-stretch">

            {/* TITLE */}

            <div className="px-6 py-5 border-b border-slate-200">

              <h2 className="text-xl font-bold">
                Pay with Wallet
              </h2>

              {/* STEPS */}

              <div className="flex items-center mt-6">

                {/* STEP 1 */}

                <Step
                  number="1"
                  title="Connect Wallet"
                  active={currentStep >= 1}
                  completed={connected}
                />

                <div className="flex-1 h-[2px] bg-slate-200 mx-5 rounded-full" />

                {/* STEP 2 */}

                <Step
                  number="2"
                  title="Authorize Payment"
                  active={currentStep >= 2}
                  completed={authorized}
                />

                <div className="flex-1 h-[2px] bg-slate-200 mx-5 rounded-full" />

                {/* STEP 3 */}

                <Step
                  number="3"
                  title="Confirm Order"
                  active={currentStep >= 3}
                  completed={completed}
                />

              </div>

            </div>

            {/* WALLET CONTENT */}

            <div className="p-6 flex-1 min-h-[680px] flex flex-col gap-5 pb-6">

              {/* CONNECTED WALLET */}

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm min-h-[185px] flex flex-col flex-none">

                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">

                  <p className="text-sm font-semibold text-slate-600">
                    Your Connected Wallet
                  </p>

                </div>

                <div className="px-6 py-6 flex-1 flex items-center justify-between gap-5">

                  <div className="flex items-center gap-3">

                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-300 via-purple-400 to-orange-300 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      VC
                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <span className="text-xl font-bold">
                          0x71C...8A92
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            copyAddress("0x71C...8A92")
                          }
                          className="text-slate-400 hover:text-blue-600"
                        >
                          <Copy size={14} />
                        </button>

                      </div>

                      <p className="text-base text-emerald-600 mt-1">
                        {connected
                          ? "Wallet connected"
                          : "Demo wallet available"}
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-sm text-slate-500">
                      Balance
                    </p>

                    <p className="text-lg font-bold">
                      312.75 USDC
                    </p>

                  </div>

                </div>

              </div>

              {/* TESTNET MESSAGE */}

              <div className="rounded-2xl bg-blue-50 border border-blue-100 px-5 py-5 min-h-[82px] flex items-center flex-none">

                <div className="flex items-center gap-2">

                  <Info
                    size={14}
                    className="text-blue-600 shrink-0"
                  />

                  <p className="text-base text-blue-700">
                    Ensure you have enough USDC on Polygon Amoy
                    Testnet to complete this payment.
                  </p>

                </div>

              </div>

              {/* SUMMARY */}

              <div className="flex-1 min-h-[330px] border border-slate-200 rounded-2xl p-7 bg-white shadow-sm flex flex-col justify-center">

                <h3 className="text-2xl font-bold mb-8">
                  Summary
                </h3>

                <div className="space-y-7">

                  <SummaryLine
                    label="You are paying"
                    value={`${numericAmount.toLocaleString(
                      "en-IN"
                    )} INR`}
                  />

                  <SummaryLine
                    label="You will pay (approx.)"
                    value={`${usdcAmount} USDC`}
                  />

                  <SummaryLine
                    label="Network Fee (est.)"
                    value={`${networkFee} USDC`}
                  />

                  <div className="pt-6 mt-3 border-t border-slate-200 flex items-center justify-between">

                    <span className="text-lg font-bold">
                      Total
                    </span>

                    <span className="text-lg font-bold">
                      {totalUsdc} USDC
                    </span>

                  </div>

                </div>

              </div>

              {/* ACTION BUTTON */}

              <button
                type="button"
                onClick={handlePaymentAction}
                disabled={completed}
                className={`w-full mt-auto h-16 rounded-2xl text-base font-semibold text-white flex items-center justify-center gap-2 transition shadow-sm ${
                  completed
                    ? "bg-emerald-600"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
                }`}
              >

                {completed ? (
                  <>
                    <Check size={17} />
                    Payment Confirmed
                  </>
                ) : (
                  <>
                    <WalletCards size={17} />
                    {getButtonText()}
                  </>
                )}

              </button>

              {/* SECURITY */}

              <div className="mt-1 flex items-center justify-center gap-2 text-sm text-slate-500">

                <LockKeyhole size={13} />

                <span>
                  Your payment is secure and encrypted
                </span>

              </div>

              {/* SUCCESS */}

              {completed && (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">

                  <div className="flex items-center gap-3">

                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Check size={17} />
                    </div>

                    <div>

                      <p className="text-sm font-bold text-emerald-700">
                        Payment Successful
                      </p>

                      <p className="text-[11px] text-emerald-600 mt-0.5">
                        The healthcare procurement order is ready
                        for confirmation.
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </div>

          </section>

        </div>

        )}

        {connected && (
          <AuthorizationPage
            assetName={assetName}
            assetId={assetId}
            manufacturer={manufacturer}
            quantity={quantity}
            numericAmount={numericAmount}
            usdcAmount={usdcAmount}
            networkFee={networkFee}
            totalUsdc={totalUsdc}
            recipient={recipient || recipientAddress}
            connected={connected}
            authorized={authorized}
            onBack={() => setConnected(false)}
            onAuthorize={handleAuthorizePayment}
            copyAddress={copyAddress}
          />
        )}

        {/* ===================================================
            BACK TO WALLET
        =================================================== */}

        <button
          type="button"
          onClick={onBack}
          className="mt-5 w-full h-10 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Wallet
        </button>

      </main>

    </div>
  );
}

// =============================================================
// AUTHORIZE PAYMENT PAGE
// Added after wallet connection — existing wallet page remains unchanged.
// =============================================================

function AuthorizationPage({
  assetName,
  assetId,
  manufacturer,
  quantity,
  numericAmount,
  usdcAmount,
  networkFee,
  totalUsdc,
  recipient,
  authorized,
  onBack,
  onAuthorize,
  copyAddress,
}) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* PAYMENT STEPS */}
      <div className="px-6 md:px-8 py-6 border-b border-slate-200">
        <div className="grid grid-cols-3 gap-4 items-center">
          <AuthorizationStep
            number="1"
            title="Connect Wallet"
            subtitle="Wallet connected successfully"
            completed
          />

          <AuthorizationStep
            number="2"
            title="Authorize Payment"
            subtitle="Review and authorize the payment"
            active={!authorized}
            completed={authorized}
          />

          <AuthorizationStep
            number="3"
            title="Confirm Order"
            subtitle="Payment verification and order confirmation"
            active={authorized}
          />
        </div>
      </div>

      {/* WARNING */}
      <div className="mx-6 md:mx-8 mt-5 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center shrink-0">
            <Info size={17} />
          </div>
          <div>
            <p className="text-sm md:text-base font-semibold text-blue-700">
              Review the payment details carefully before authorizing the transaction.
            </p>
            <p className="text-xs md:text-sm text-blue-600 mt-1">
              This action cannot be reversed.
            </p>
          </div>
        </div>
      </div>

      {/* TWO COLUMNS */}
      <div className="p-6 md:p-8 grid grid-cols-1 xl:grid-cols-[1.25fr_0.9fr] gap-6">
        {/* LEFT — AUTHORIZE PAYMENT */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-200 bg-white">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Authorize Payment
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-1">
              You are about to authorize the following payment
            </p>
          </div>

          <div className="p-5 md:p-6 space-y-2">
            <DetailRow icon="▣" label="Order ID" value="VTC-ORD-2026-0081" />
            <DetailRow icon="◉" label="Asset / Vaccine" value={assetName} />
            <DetailRow icon="◇" label="Asset ID" value={assetId} />
            <DetailRow icon="▥" label="Manufacturer" value={manufacturer} />
            <DetailRow icon="▣" label="Quantity" value={quantity} />

            <div className="rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                  ₹
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-700">Amount</p>
                  <p className="text-xs text-slate-500">Healthcare asset payment</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl md:text-2xl font-extrabold text-blue-600">
                  ₹ {numericAmount.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  ≈ {usdcAmount} USDC
                </p>
              </div>
            </div>

            <DetailRow
              icon="$"
              label="Payment Token"
              value="USDC (Polygon Amoy)"
            />

            <div className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-3.5 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-sm">♙</span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Recipient
                  </p>
                  <p className="text-sm md:text-base font-medium text-slate-700">
                    Wallet Address
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm font-semibold text-slate-500">
                  {recipient}
                </span>
                <button
                  type="button"
                  onClick={() => copyAddress(recipient)}
                  className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-center"
                  title="Copy recipient address"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>

            <DetailRow
              icon="●"
              label="Network"
              value="Polygon Amoy Testnet"
              purple
            />

            <DetailRow
              icon="◷"
              label="Network Fee (est.)"
              value={`${networkFee} USDC`}
            />

            <DetailRow
              icon="◈"
              label="Total You Will Pay"
              value={`${totalUsdc} USDC`}
              last
            />

            {/* SECURITY */}
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white text-amber-600 flex items-center justify-center shrink-0">
                  <LockKeyhole size={15} />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-700">
                    Secure Authorization
                  </p>
                  <p className="text-xs md:text-sm leading-5 text-amber-700/80 mt-1">
                    By authorizing this payment, you are signing a transaction
                    with your wallet. Make sure you trust the recipient and all
                    payment details.
                  </p>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-3 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="h-12 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                type="button"
                onClick={onAuthorize}
                disabled={authorized}
                className={`h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition ${
                  authorized
                    ? "bg-emerald-600"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.99]"
                }`}
              >
                {authorized ? (
                  <>
                    <Check size={17} />
                    Payment Authorized
                  </>
                ) : (
                  <>
                    <LockKeyhole size={17} />
                    Authorize Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — SUMMARY + NEXT STEPS */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-7">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              Payment Summary
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-1">
              Review your payment details
            </p>

            <div className="mt-6 space-y-6">
              <SummaryLine
                label="You are paying"
                value={`${numericAmount.toLocaleString("en-IN")} INR`}
              />

              <SummaryLine
                label="You will pay (approx.)"
                value={`${usdcAmount} USDC`}
              />

              <SummaryLine
                label="Network Fee (est.)"
                value={`${networkFee} USDC`}
              />

              <div className="pt-5 border-t border-slate-200 flex items-center justify-between gap-4">
                <span className="text-lg md:text-xl font-bold text-slate-900">
                  Total
                </span>
                <span className="text-lg md:text-xl font-extrabold text-slate-900">
                  {totalUsdc} USDC
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 md:p-7">
            <h3 className="text-lg md:text-xl font-bold text-emerald-800">
              What happens next?
            </h3>

            <div className="mt-5 space-y-5">
              <NextStep
                number="1"
                title="Payment Authorized"
                description="Your wallet will sign the transaction"
                active={authorized}
              />
              <NextStep
                number="2"
                title="Payment Verified"
                description="Payment will be verified on the blockchain"
                active={authorized}
              />
              <NextStep
                number="3"
                title="Order Confirmed"
                description="Your healthcare procurement order will be confirmed"
                active={false}
              />
              <NextStep
                number="4"
                title="Asset Registered"
                description="Asset will be added to VITALChain and tracking will begin"
                active={false}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-white text-blue-600 flex items-center justify-center shrink-0">
                <Info size={17} />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-700">
                  x402 Payment Protocol
                </p>
                <p className="text-xs md:text-sm text-blue-600 mt-1 leading-5">
                  This payment uses the x402 HTTP-native payment protocol.
                  Secure • Verifiable • Transparent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AuthorizationStep({
  number,
  title,
  subtitle,
  active = false,
  completed = false,
}) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center shrink-0 font-bold ${
          completed
            ? "bg-emerald-600 text-white"
            : active
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-500 border border-slate-200"
        }`}
      >
        {completed ? <Check size={18} /> : number}
      </div>

      <div className="min-w-0">
        <p
          className={`text-sm md:text-base font-bold ${
            active || completed ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {number}. {title}
        </p>
        <p className="hidden md:block text-xs text-slate-500 truncate">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function NextStep({
  number,
  title,
  description,
  active = false,
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
          active
            ? "bg-emerald-600 text-white"
            : "bg-white text-emerald-700 border border-emerald-200"
        }`}
      >
        {number}
      </div>

      <div>
        <p className="text-sm font-bold text-emerald-800">{title}</p>
        <p className="text-xs text-emerald-700/80 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// =============================================================
// DETAIL ROW
// =============================================================

function DetailRow({
  icon,
  label,
  value,
  purple = false,
  last = false,
}) {
  return (
    <div
      className={`group flex items-center justify-between gap-4 rounded-xl border px-3.5 py-2.5 transition ${
        purple
          ? "border-purple-200 bg-purple-50/50 hover:bg-purple-50"
          : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
      }`}
    >

      <div className="flex items-center gap-3 min-w-0">

        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0 ${
            purple
              ? "bg-white text-purple-600 border border-purple-100"
              : "bg-slate-50 text-blue-600 border border-slate-100"
          }`}
        >
          {icon}
        </div>

        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>

      </div>

      <span
        className={`text-sm font-semibold text-right truncate max-w-[55%] ${
          purple
            ? "text-purple-700"
            : "text-slate-800"
        }`}
      >
        {value}
      </span>

    </div>
  );
}

// =============================================================
// PAYMENT STEP
// =============================================================

function Step({
  number,
  title,
  active,
  completed,
}) {
  return (
    <div className="flex items-center gap-3 min-w-0 shrink-0">

      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-200 ${
          completed
            ? "bg-blue-600 text-white shadow-md shadow-blue-100"
            : active
              ? "bg-blue-600 text-white shadow-md shadow-blue-100"
              : "bg-slate-100 text-slate-500 border border-slate-200"
        }`}
      >
        {completed ? (
          <Check size={18} strokeWidth={2.5} />
        ) : (
          number
        )}
      </div>

      <span
        className={`hidden sm:block text-sm md:text-base font-semibold whitespace-nowrap ${
          active
            ? "text-blue-600"
            : "text-slate-400"
        }`}
      >
        {title}
      </span>

    </div>
  );
}

// =============================================================
// SUMMARY LINE
// =============================================================

function SummaryLine({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-base text-slate-600">
        {label}
      </span>

      <span className="text-lg font-semibold text-slate-900">
        {value}
      </span>

    </div>
  );
}

export default Send;