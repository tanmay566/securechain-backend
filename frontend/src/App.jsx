import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import AssetDetails from "./pages/AssetDetails";
import NewAsset from "./pages/NewAsset";
import Wallet from "./pages/Wallet";
import Send from "./pages/Send";
import ConfirmOrder from "./pages/ConfirmOrder";
import VerifyVaccine from "./pages/VerifyVaccine";
import VaccineTraceability from "./pages/VaccineTraceability";
import api from "./api/api";

function App() {
  // =========================================================
  // CHECK PUBLIC URL
  // =========================================================

  const getInitialPage = () => {
    const pathname = window.location.pathname;

    /*
      PUBLIC VACCINE VERIFICATION

      Supported URLs:

      /verify?medId=zero33%2F3

      /verify-vaccine?medId=zero33%2F3

      /verify-vaccine/details?medId=zero33%2F3
    */

    if (
      pathname === "/verify" ||
      pathname === "/verify-vaccine"
    ) {
      return "verify-vaccine";
    }

    if (pathname === "/verify-vaccine/details") {
      return "vaccine-details";
    }

    if (pathname === "/vaccine-traceability") {
      return "vaccine-details";
    }

    return "dashboard";
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // =========================================================
  // CURRENT PAGE
  // =========================================================

  const [currentPage, setCurrentPage] =
    useState(getInitialPage);

  // =========================================================
  // SELECTED ASSET
  // =========================================================

  const [selectedAsset, setSelectedAsset] = useState(null);

  // =========================================================
  // CONFIRM ORDER DATA
  // =========================================================

  const [confirmOrderData, setConfirmOrderData] =
    useState(null);

  // =========================================================
  // PATIENT VERIFICATION DATA
  // =========================================================

  const [patientVerificationData, setPatientVerificationData] =
    useState(() => {
      try {
        const saved = localStorage.getItem(
          "vitalchain_patient_verification"
        );

        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    });

  // =========================================================
  // ASSETS — BACKEND IS THE ONLY SOURCE OF TRUTH
  // =========================================================

  const [assets, setAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(true);

  // Clear the old frontend cache once. Asset records must never be
  // resurrected from localStorage after being deleted from the backend.
  useEffect(() => {
    try {
      localStorage.removeItem("vitalchain_assets");
    } catch (error) {
      console.warn("Could not clear legacy asset cache:", error);
    }
  }, []);

  // =========================================================
  // LOAD ASSETS FROM BACKEND
  // =========================================================

  const loadBackendAssets = async () => {
    const backendAssets = await api.assets.list();
    return Array.isArray(backendAssets) ? backendAssets : [];
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setAssetsLoading(true);
        const backendAssets = await loadBackendAssets();
        if (!cancelled) setAssets(backendAssets);
      } catch (error) {
        console.error("Could not load assets from backend:", error);
        if (!cancelled) setAssets([]);
      } finally {
        if (!cancelled) setAssetsLoading(false);
      }
    };

    load();

    const handleAssetUpdated = () => {
      load().catch(() => {});
    };

    window.addEventListener("vitalchain:asset-updated", handleAssetUpdated);
    return () => {
      cancelled = true;
      window.removeEventListener("vitalchain:asset-updated", handleAssetUpdated);
    };
  }, []);

  // =========================================================
  // CREATE NEW ASSET
  // =========================================================

  const handleCreateAsset = (newAsset) => {
    // NewAsset collects the form; the actual DB/chain registration happens
    // only after payment confirmation in handlePaymentSuccess.
    setSelectedAsset(newAsset);
    setCurrentPage("wallet");
  };

  // =========================================================
  // PAYMENT SUCCESS / REGISTER ASSET
  // =========================================================

  const handlePaymentSuccess = async (paidAsset) => {
    console.log("Confirm & Register Asset clicked:", paidAsset);

    if (!paidAsset) {
      alert("Unable to register the asset because asset data is missing.");
      return;
    }

    const formAssetId = String(
      paidAsset.assetId || paidAsset.assetID || paidAsset.id || ""
    ).trim();

    if (!formAssetId) {
      alert("Asset ID is missing.");
      return;
    }

    const completeAsset = {
      ...paidAsset,
      id: formAssetId,
      assetId: formAssetId,
      paymentStatus: "Successful",
      paymentId: paidAsset.paymentId || `VCH-${Date.now().toString().slice(-8)}`,
      paymentMethod: paidAsset.paymentMethod || "Wallet",
      paymentDate: paidAsset.paymentDate || new Date().toLocaleString("en-IN"),
      status: paidAsset.status || "Delivered",
      registrationStatus: "Registered",
      registeredAt: new Date().toISOString(),
    };

    try {
      // This is the authoritative write: DB + blockchain event.
      const backendAsset = await api.assets.create(completeAsset);
      const freshAssets = await loadBackendAssets();

      setAssets(freshAssets);
      setSelectedAsset(backendAsset);
      setConfirmOrderData(null);
      setCurrentPage("assets");
    } catch (error) {
      console.error("Asset registration failed:", error);
      alert(error?.message || "Unable to register the asset with the backend.");
    }
  };

  // =========================================================
  // ASSET DETAILS
  // =========================================================

  const handleAssetClick = (
    asset
  ) => {
    setSelectedAsset(asset);

    setCurrentPage(
      "asset-details"
    );
  };

  // =========================================================
  // WALLET
  // =========================================================

  const handlePayNow = (
    asset
  ) => {
    setSelectedAsset(asset);

    setCurrentPage(
      "wallet"
    );
  };

  // =========================================================
  // SEND
  // =========================================================

  const handleSend = () => {
    setCurrentPage(
      "send"
    );
  };

  // =========================================================
  // CONFIRM ORDER
  // =========================================================

  const handleConfirmOrder = (
    paymentData
  ) => {
    if (
      paymentData?.selectedAsset
    ) {
      setSelectedAsset(
        paymentData.selectedAsset
      );
    }

    setConfirmOrderData(
      paymentData
    );

    setCurrentPage(
      "confirm-order"
    );
  };

  // =========================================================
  // VACCINE VERIFICATION
  // =========================================================

  const handleVaccineVerification = async (patientData) => {
    console.log("Vaccine verification:", patientData);

    if (!patientData?.assetId) {
      alert("Asset ID is missing. Please scan the vaccine QR code again.");
      return;
    }

    const fullName = patientData.fullName?.trim() || "";
    const phone = patientData.phone?.trim() || "";
    const assetId = patientData.assetId.trim();

    if (!fullName) {
      alert("Please enter the patient's full name.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      // The backend is authoritative for public vaccine registration.
      // This creates the patient + vaccination record, marks the asset
      // administered, and writes the blockchain event.
      const response = await api.vaccinations.register({
        fullName,
        phone,
        assetId,
        hospital: "VITALChain Hospital",
      });

      if (!response?.success || !response?.vaccination || !response?.asset) {
        throw new Error("Backend returned an incomplete vaccination response.");
      }

      const vaccination = response.vaccination;
      const backendAsset = response.asset;

      const patientRecord = {
        fullName: vaccination.patientName || fullName,
        phone: vaccination.patientMobile || phone,
        assetId: vaccination.assetId || assetId,
        registrationDate:
          vaccination.registeredAt ||
          new Date().toISOString(),
        vaccinationId: vaccination.vaccinationId,
        hospital: vaccination.hospital || "VITALChain Hospital",
        blockchainHash: vaccination.blockchainHash || null,
      };

      setPatientVerificationData(patientRecord);

      try {
        localStorage.setItem(
          "vitalchain_patient_verification",
          JSON.stringify(patientRecord)
        );
      } catch (storageError) {
        console.warn(
          "Could not save patient verification locally:",
          storageError
        );
      }

      // Keep the authoritative backend asset while preserving useful
      // frontend fields that may exist on locally-created demo assets.
      const existingAsset = assets.find((asset) => {
        const existingId = String(
          asset.assetId || asset.assetID || asset.id || ""
        )
          .trim()
          .toLowerCase();

        return existingId === assetId.toLowerCase();
      });

      const completeAsset = {
        ...(existingAsset || {}),
        ...backendAsset,
        id: backendAsset.assetId || assetId,
        assetId: backendAsset.assetId || assetId,
        patientName: patientRecord.fullName,
        patientMobile: patientRecord.phone,
        vaccinationId: patientRecord.vaccinationId,
        registeredAt: patientRecord.registrationDate,
        hospital: patientRecord.hospital,
        blockchainHash: patientRecord.blockchainHash,
        status: backendAsset.status || "Administered",
      };

      setAssets((previousAssets) => {
        const existingIndex = previousAssets.findIndex((asset) => {
          const existingId = String(
            asset.assetId || asset.assetID || asset.id || ""
          )
            .trim()
            .toLowerCase();

          return existingId === assetId.toLowerCase();
        });

        if (existingIndex === -1) {
          return [completeAsset, ...previousAssets];
        }

        return previousAssets.map((asset, index) =>
          index === existingIndex
            ? { ...asset, ...completeAsset }
            : asset
        );
      });

      setSelectedAsset(completeAsset);
      setCurrentPage("vaccine-details");
    } catch (error) {
      console.error("Vaccine registration failed:", error);

      const message =
        error?.message ||
        "Unable to verify/register this vaccine. Please try again.";

      alert(message);
    }
  };

  // =========================================================
  // HANDLE PUBLIC URL
  // =========================================================

  useEffect(() => {
    const pathname =
      window.location.pathname;

    /*
      Only handle public traceability URLs here.

      /verify is handled by the initial page
      and VerifyVaccine itself.
    */

    const isTraceabilityPage =
      pathname ===
        "/vaccine-traceability" ||
      pathname ===
        "/verify-vaccine/details";

    if (!isTraceabilityPage) {
      return;
    }

    try {
      const params =
        new URLSearchParams(
          window.location.search
        );

      // New QR links use the complete Med ID, e.g. zero33/3.
      // assetId remains supported for older QR links.
      const qrAssetId =
        (
          params.get("medId") ||
          params.get("assetId")
        )?.trim();

      if (!qrAssetId) {
        setCurrentPage(
          "verify-vaccine"
        );

        return;
      }

      // Find asset
      let matchedAsset =
        assets.find(
          (asset) => {
            const existingId =
              asset.assetId ||
              asset.assetID ||
              asset.id ||
              "";

            return (
              String(
                existingId
              )
                .trim()
                .toLowerCase() ===
              qrAssetId.toLowerCase()
            );
          }
        );

      if (!matchedAsset) {
        api.assets
          .getStatus(qrAssetId)
          .then((backendAsset) => {
            setSelectedAsset(backendAsset);

            const savedPatient = localStorage.getItem(
              "vitalchain_patient_verification"
            );

            if (savedPatient) {
              try {
                const parsedPatient = JSON.parse(savedPatient);

                if (
                  String(parsedPatient?.assetId || "")
                    .trim()
                    .toLowerCase() === qrAssetId.toLowerCase()
                ) {
                  setPatientVerificationData(parsedPatient);
                }
              } catch {
                // Ignore malformed local patient data.
              }
            }

            setCurrentPage("vaccine-details");
          })
          .catch((backendError) => {
            console.error(
              "No registered asset found:",
              qrAssetId,
              backendError
            );
            setSelectedAsset(null);
            setCurrentPage("verify-vaccine");
          });

        return;
      }

      // Get patient information
      const savedPatient =
        localStorage.getItem(
          "vitalchain_patient_verification"
        );

      let parsedPatient = null;

      if (savedPatient) {
        try {
          parsedPatient =
            JSON.parse(
              savedPatient
            );
        } catch {
          parsedPatient = null;
        }
      }

      if (
        parsedPatient &&
        String(
          parsedPatient.assetId ||
          ""
        )
          .trim()
          .toLowerCase() ===
          qrAssetId.toLowerCase()
      ) {
        setPatientVerificationData(
          parsedPatient
        );
      }

      setSelectedAsset(
        matchedAsset
      );

      setCurrentPage(
        "vaccine-details"
      );
    } catch (error) {
      console.error(
        "Error opening traceability page:",
        error
      );

      setCurrentPage(
        "verify-vaccine"
      );
    }
  }, [assets]);

  // =========================================================
  // PUBLIC VERIFY PAGE
  // =========================================================

  /*
    THIS IS THE IMPORTANT PART.

    These URLs now open VerifyVaccine:

    /verify?medId=zero33%2F3

    /verify-vaccine?medId=zero33%2F3
  */

  if (
    currentPage ===
    "verify-vaccine"
  ) {
    return (
      <VerifyVaccine
        onVerify={
          handleVaccineVerification
        }
      />
    );
  }

  // =========================================================
  // PUBLIC VACCINE TRACEABILITY
  // =========================================================

  if (
    currentPage ===
      "vaccine-details" &&
    selectedAsset
  ) {
    return (
      <VaccineTraceability
        asset={
          selectedAsset
        }

        patient={
          patientVerificationData
        }

        onBackToAssets={() => {
          setCurrentPage(
            "verify-vaccine"
          );
        }}

        onDashboardClick={() => {
          setCurrentPage(
            "verify-vaccine"
          );
        }}
      />
    );
  }

  // =========================================================
  // ADMIN LOGIN
  // =========================================================

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={() => {
          setIsLoggedIn(true);

          setCurrentPage(
            "dashboard"
          );
        }}
      />
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  if (
    currentPage ===
    "dashboard"
  ) {
    return (
      <Dashboard
        onAssetsClick={() => {
          setCurrentPage(
            "assets"
          );
        }}
      />
    );
  }

  // =========================================================
  // ASSETS
  // =========================================================

  if (
    currentPage ===
    "assets"
  ) {
    return (
      <Assets
        assets={assets}

        onDashboardClick={() => {
          setCurrentPage(
            "dashboard"
          );
        }}

        onAddAssetClick={() => {
          setCurrentPage(
            "new-asset"
          );
        }}

        onAssetClick={
          handleAssetClick
        }
      />
    );
  }

  // =========================================================
  // NEW ASSET
  // =========================================================

  if (
    currentPage ===
    "new-asset"
  ) {
    return (
      <NewAsset
        onCancel={() => {
          setCurrentPage(
            "assets"
          );
        }}

        onCreateAsset={
          handleCreateAsset
        }

        onPayNow={(asset) => {
          setSelectedAsset(
            asset
          );

          setCurrentPage(
            "wallet"
          );
        }}
      />
    );
  }

  // =========================================================
  // ASSET DETAILS
  // =========================================================

  if (
    currentPage ===
      "asset-details" &&
    selectedAsset
  ) {
    return (
      <AssetDetails
        asset={
          selectedAsset
        }

        onBackToAssets={() => {
          setCurrentPage(
            "assets"
          );
        }}

        onDashboardClick={() => {
          setCurrentPage(
            "dashboard"
          );
        }}

        onPayNow={
          handlePayNow
        }
      />
    );
  }

  // =========================================================
  // WALLET
  // =========================================================

  if (
    currentPage ===
    "wallet"
  ) {
    return (
      <Wallet
        selectedAsset={
          selectedAsset
        }

        onDashboardClick={() => {
          setCurrentPage(
            "dashboard"
          );
        }}

        onAssetsClick={() => {
          setCurrentPage(
            "assets"
          );
        }}

        onSendClick={
          handleSend
        }
      />
    );
  }

  // =========================================================
  // SEND
  // =========================================================

  if (
    currentPage ===
    "send"
  ) {
    return (
      <Send
        selectedAsset={
          selectedAsset
        }

        onBack={() => {
          setCurrentPage(
            "wallet"
          );
        }}

        onDashboardClick={() => {
          setCurrentPage(
            "dashboard"
          );
        }}

        onAssetsClick={() => {
          setCurrentPage(
            "assets"
          );
        }}

        onConfirmOrder={
          handleConfirmOrder
        }
      />
    );
  }

  // =========================================================
  // CONFIRM ORDER
  // =========================================================

  if (
    currentPage ===
      "confirm-order" &&
    confirmOrderData
  ) {
    return (
      <ConfirmOrder
        paymentData={
          confirmOrderData
        }

        selectedAsset={
          confirmOrderData.selectedAsset ||
          selectedAsset
        }

        onBack={() => {
          setCurrentPage(
            "send"
          );
        }}

        onConfirm={(
          confirmedAsset
        ) => {
          handlePaymentSuccess(
            confirmedAsset ||
              confirmOrderData.selectedAsset ||
              selectedAsset
          );
        }}
      />
    );
  }

  // =========================================================
  // FALLBACK
  // =========================================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">

        <h1 className="text-2xl font-bold text-slate-900">
          Page Not Found
        </h1>

        <button
          onClick={() => {
            setCurrentPage(
              "dashboard"
            );
          }}
          className="
            mt-4
            rounded-lg
            bg-blue-600
            px-5
            py-2
            font-semibold
            text-white
            transition
            hover:bg-blue-700
          "
        >
          Go to Dashboard
        </button>

      </div>
    </div>
  );
}

export default App;