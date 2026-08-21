import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  User,
  Phone,
  Hash,
  Lock,
  ArrowRight,
  QrCode,
  Info,
} from "lucide-react";

function VerifyVaccine({ onVerify }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  // The complete Med ID identifies one specific vial.
  // Example: zero33/3 = batch zero33, vial 3.
  const [medId, setMedId] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // GET ASSET ID FROM QR CODE / URL
  // =========================================================
  //
  // QR code should eventually open something like:
  //
  // http://localhost:5173/verify-vaccine?assetId=DEMO1323
  //
  // We automatically read DEMO1323 from the URL.
  //
  // =========================================================

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // New QR links use ?medId=zero33/3.
    // Keep assetId as a backwards-compatible fallback for older links.
    const qrMedId =
      params.get("medId") || params.get("assetId");

    if (qrMedId) {
      setMedId(qrMedId.trim());
    }
  }, []);

  // =========================================================
  // FORM SUBMIT
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // Name validation
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    // Phone validation
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    // Med ID validation
    if (!medId) {
      setError(
        "Med ID was not detected. Please scan the vaccine QR code again."
      );
      return;
    }

    // =======================================================
    // SAVE PATIENT INFORMATION
    // =======================================================

    const patientData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      // Keep the backend field name for compatibility, but its value
      // is now the complete Med ID, e.g. zero33/3.
      assetId: medId,
      medId: medId,
    };

    localStorage.setItem(
      "vitalchain_patient_verification",
      JSON.stringify(patientData)
    );

    console.log("Patient verification data:", patientData);

    // =======================================================
    // GO TO VACCINE DETAILS
    // =======================================================

    // IMPORTANT:
    // Do NOT use window.location.href here.
    //
    // window.location.href reloads the whole React application.
    // When the app reloads, the selected asset React state is lost
    // and your normal admin login page can appear.
    //
    // Instead, send the verified data to App.jsx. App.jsx will
    // find the matching asset and render VaccineTraceability
    // without going through the admin login screen.
    if (onVerify) {
      onVerify(patientData);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8fc] px-4 py-8 sm:px-6 lg:px-8">

      {/* =====================================================
          MAIN PAGE
      ===================================================== */}

      <div className="mx-auto max-w-5xl">

        {/* ===================================================
            TOP BRAND / TITLE AREA
        =================================================== */}

        <div className="mb-8 text-center">

          {/* Shield */}

          <div className="mb-5 flex justify-center">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-blue-100 bg-white shadow-md shadow-blue-100">
              <ShieldCheck
                size={40}
                strokeWidth={1.8}
                className="text-blue-600"
              />
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Verify Vaccine
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-base text-slate-500 sm:text-lg">
            Verify your vaccine and securely register it to your name
          </p>

        </div>

        {/* ===================================================
            MAIN CARD
        =================================================== */}

        <div className="mx-auto max-w-3xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

          {/* =================================================
              BLUE CARD HEADER
          ================================================= */}

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 px-6 py-8 text-white sm:px-10">

            {/* Decorative circles */}

            <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />

            <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative flex items-center gap-5">

              {/* QR ICON */}

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner backdrop-blur-sm">
                <QrCode
                  size={32}
                  strokeWidth={2}
                />
              </div>

              {/* HEADER TEXT */}

              <div>

                <p className="text-sm font-medium text-blue-100">
                  VITALChain Secure Verification
                </p>

                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Scan QR & Verify
                </h2>

                <p className="mt-1 text-sm text-blue-100 sm:text-base">
                  Enter your details to verify this healthcare asset
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              FORM AREA
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="px-6 py-8 sm:px-10 sm:py-10"
          >

            {/* =================================================
                INFORMATION MESSAGE
            ================================================= */}

            <div className="mb-8 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-4">

              <div className="mt-0.5 shrink-0">
                <Info
                  size={19}
                  className="text-blue-600"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Register Vaccine
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  Enter your details below. The Med ID is preloaded from the
                  vaccine QR code and cannot be changed.
                </p>
              </div>

            </div>

            {/* =================================================
                MED ID
            ================================================= */}

            <div className="mb-7">

              <div className="mb-2.5 flex items-center justify-between">

                <label className="block text-sm font-bold text-slate-800">
                  Med ID
                </label>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  Preloaded
                </span>

              </div>

              <div className="flex overflow-hidden rounded-2xl border border-blue-200 bg-blue-50/60 shadow-sm">

                {/* HASH ICON */}

                <div className="flex w-14 shrink-0 items-center justify-center border-r border-blue-200 bg-blue-100/60">

                  <Hash
                    size={21}
                    strokeWidth={1.8}
                    className="text-blue-600"
                  />

                </div>

                {/* ASSET ID */}

                <input
                  type="text"
                  value={medId}
                  readOnly
                  aria-label="Med ID"
                  placeholder="Med ID will appear here"
                  className="w-full cursor-not-allowed bg-transparent px-4 py-4 text-base font-bold tracking-wide text-blue-700 outline-none placeholder:font-normal placeholder:text-slate-400"
                />

                {/* LOCK */}

                <div className="flex w-14 shrink-0 items-center justify-center border-l border-blue-200">

                  <Lock
                    size={19}
                    className="text-blue-500"
                  />

                </div>

              </div>

              <div className="mt-2.5 flex items-start gap-2 text-xs leading-5 text-slate-500">

                <Lock
                  size={14}
                  className="mt-0.5 shrink-0 text-slate-400"
                />

                <span>
                  This Med ID identifies this specific vaccine vial and was
                  preloaded from the vaccine QR code. It cannot be edited.
                </span>

              </div>

            </div>


            {/* =================================================
                FULL NAME
            ================================================= */}

            <div className="mb-6">

              <label className="mb-2.5 block text-sm font-bold text-slate-800">
                Full Name
              </label>

              <div className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">

                <div className="flex w-14 shrink-0 items-center justify-center border-r border-slate-200 bg-slate-50 transition group-focus-within:bg-blue-50">

                  <User
                    size={21}
                    strokeWidth={1.8}
                    className="text-slate-500 group-focus-within:text-blue-600"
                  />

                </div>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full bg-transparent px-4 py-4 text-base font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
                />

              </div>

            </div>

            {/* =================================================
                PHONE NUMBER
            ================================================= */}

            <div className="mb-6">

              <label className="mb-2.5 block text-sm font-bold text-slate-800">
                Phone Number
              </label>

              <div className="group flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">

                <div className="flex w-14 shrink-0 items-center justify-center border-r border-slate-200 bg-slate-50 transition group-focus-within:bg-blue-50">

                  <Phone
                    size={21}
                    strokeWidth={1.8}
                    className="text-slate-500 group-focus-within:text-blue-600"
                  />

                </div>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);

                    setPhone(value);
                  }}
                  placeholder="Enter your 10-digit mobile number"
                  maxLength={10}
                  className="w-full bg-transparent px-4 py-4 text-base font-medium tracking-wide text-slate-900 outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                />

              </div>

              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                <Lock size={12} />
                Your phone number is used only for vaccine registration.
              </p>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-600">

                <Info
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {error}
                </span>

              </div>
            )}

            {/* =================================================
                SUBMIT BUTTON
            ================================================= */}

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4.5 text-base font-bold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 active:translate-y-0 active:scale-[0.99]"
            >

              <ShieldCheck
                size={22}
                strokeWidth={2}
              />

              <span>
                Continue & View Vaccine
              </span>

              <ArrowRight
                size={21}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />

            </button>

            {/* =================================================
                SECURITY FOOTER
            ================================================= */}

            <div className="mt-6 flex items-center justify-center gap-2 text-center">

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50">
                <Lock
                  size={13}
                  className="text-green-600"
                />
              </div>

              <p className="text-xs text-slate-400 sm:text-sm">
                Secure verification powered by{" "}
                <span className="font-semibold text-slate-500">
                  VITALChain
                </span>
              </p>

            </div>

          </form>

        </div>

        {/* ===================================================
            BOTTOM TRUST MESSAGE
        =================================================== */}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">

          <span className="flex items-center gap-1.5">
            <ShieldCheck
              size={14}
              className="text-green-500"
            />
            Verified Healthcare Asset
          </span>

          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

          <span className="flex items-center gap-1.5">
            <Lock
              size={13}
              className="text-blue-500"
            />
            Secure Registration
          </span>

          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

          <span>
            VITALChain Blockchain
          </span>

        </div>

      </div>

    </div>
  );
}

export default VerifyVaccine;