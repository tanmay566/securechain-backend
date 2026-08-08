import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import AssetDetails from "./pages/AssetDetails";
import NewAsset from "./pages/NewAsset";


function App() {

  // =========================================================
  // LOGIN STATE
  // =========================================================

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // =========================================================
  // CURRENT PAGE
  // =========================================================

  const [currentPage, setCurrentPage] = useState("dashboard");


  // =========================================================
  // SELECTED ASSET
  // =========================================================

  const [selectedAsset, setSelectedAsset] = useState(null);


  // =========================================================
  // DEFAULT ASSETS
  // =========================================================

  const defaultAssets = [

    // =======================================================
    // COVISHIELD
    // =======================================================

    {
      id: "VC-IND-2026-000981",

      name: "COVISHIELD",

      fullName:
        "COVISHIELD (ChAdOx1 nCoV-19)",

      batchNumber:
        "DEMO-COV-260501",

      category:
        "Vaccines",

      manufacturer:
        "Serum Institute of India Pvt. Ltd.",

      manufacturingAddress:
        "212/2, Hadapsar, Off Soli Poonawalla Road, Pune – 411028, Maharashtra, India",

      manufacturingDate:
        "01 May 2026",

      expiryDate:
        "31 October 2026",

      storageRequirement:
        "2°C – 8°C",

      quantity:
        "500 Vials",

      status:
        "Delivered",

      origin:
        "Serum Institute of India, Pune, Maharashtra",

      destination:
        "AIIMS New Delhi, Ansari Nagar, New Delhi – 110029",

      transportMode:
        "Temperature-controlled road transport",

      vehicleNumber:
        "MH-12-AB-4582",

      driver:
        "Ramesh Kumar",

      dispatchDate:
        "05 May 2026 — 08:30 AM",

      expectedDelivery:
        "07 May 2026 — 02:00 PM",

      temperatureRange:
        "2°C – 8°C",
    },


    // =======================================================
    // PFIZER
    // =======================================================

    {
      id: "SC-VAC-8992",

      name:
        "Pfizer-BioNTech COVID-19",

      fullName:
        "Pfizer-BioNTech COVID-19",

      batchNumber:
        "B-PFZ-2026",

      category:
        "Vaccines",

      manufacturer:
        "Pfizer Inc.",

      manufacturingAddress:
        "United States",

      manufacturingDate:
        "12 April 2026",

      expiryDate:
        "12 October 2026",

      storageRequirement:
        "-70°C to -60°C",

      quantity:
        "300 Vials",

      status:
        "Delivered",

      origin:
        "Pfizer Distribution Center",

      destination:
        "Central Hub Cold Storage Unit A",

      transportMode:
        "Temperature-controlled road transport",

      vehicleNumber:
        "DL-01-AB-7821",

      driver:
        "Demo Driver",

      dispatchDate:
        "15 April 2026 — 09:00 AM",

      expectedDelivery:
        "16 April 2026 — 04:00 PM",

      temperatureRange:
        "-70°C to -60°C",
    },


    // =======================================================
    // ULTRASOUND
    // =======================================================

    {
      id:
        "SC-EQP-1044",

      name:
        "Portable Ultrasound X3",

      fullName:
        "Portable Ultrasound X3",

      batchNumber:
        "US-2026-1044",

      category:
        "Diagnostic Equipment",

      manufacturer:
        "Healthcare Medical Systems",

      manufacturingAddress:
        "New Delhi, India",

      manufacturingDate:
        "01 March 2026",

      expiryDate:
        "01 March 2031",

      storageRequirement:
        "15°C – 30°C",

      quantity:
        "1 Unit",

      status:
        "Delivered",

      origin:
        "Medical Equipment Warehouse",

      destination:
        "Fleet Vehicle #42",

      transportMode:
        "Road Transport",

      vehicleNumber:
        "DL-42-XY-1001",

      driver:
        "Demo Driver",

      dispatchDate:
        "02 March 2026 — 10:00 AM",

      expectedDelivery:
        "03 March 2026 — 03:00 PM",

      temperatureRange:
        "15°C – 30°C",
    },

  ];


  // =========================================================
  // LOAD ASSETS FROM LOCAL STORAGE
  // =========================================================

  const [assets, setAssets] = useState(() => {

    try {

      const savedAssets =
        localStorage.getItem("vitalchain_assets");

      if (savedAssets) {

        return JSON.parse(savedAssets);

      }

      return defaultAssets;

    } catch (error) {

      console.error(
        "Error loading assets:",
        error
      );

      return defaultAssets;

    }

  });


  // =========================================================
  // SAVE ASSETS TO LOCAL STORAGE
  // =========================================================

  useEffect(() => {

    try {

      localStorage.setItem(
        "vitalchain_assets",
        JSON.stringify(assets)
      );

    } catch (error) {

      console.error(
        "Error saving assets:",
        error
      );

    }

  }, [assets]);


  // =========================================================
  // CREATE NEW ASSET
  // =========================================================

  const handleCreateAsset = (newAsset) => {

    // Add the new asset to the beginning
    // of the asset list.

    setAssets((previousAssets) => {

      const updatedAssets = [
        newAsset,
        ...previousAssets,
      ];

      return updatedAssets;

    });


    // Automatically select the newly created asset.

    setSelectedAsset(newAsset);


    // After creating the asset,
    // go back to Assets page.

    setCurrentPage("assets");

  };


  // =========================================================
  // OPEN ASSET DETAILS
  // =========================================================

  const handleAssetClick = (asset) => {

    // Store the exact asset that was clicked.

    setSelectedAsset(asset);


    // Open the dynamic details page.

    setCurrentPage("asset-details");

  };


  // =========================================================
  // LOGIN PAGE
  // =========================================================

  if (!isLoggedIn) {

    return (

      <Login
        onLogin={() => {
          setIsLoggedIn(true);
          setCurrentPage("dashboard");
        }}
      />

    );

  }


  // =========================================================
  // DASHBOARD PAGE
  // =========================================================

  if (currentPage === "dashboard") {

    return (

      <Dashboard
        onAssetsClick={() => {
          setCurrentPage("assets");
        }}
      />

    );

  }


  // =========================================================
  // ASSETS PAGE
  // =========================================================

  if (currentPage === "assets") {

    return (

      <Assets

        // Send all assets to Assets.jsx
        assets={assets}


        // Dashboard button
        onDashboardClick={() => {
          setCurrentPage("dashboard");
        }}


        // Add New Asset button
        onAddAssetClick={() => {
          setCurrentPage("new-asset");
        }}


        // When an asset is clicked
        onAssetClick={handleAssetClick}

      />

    );

  }


  // =========================================================
  // NEW ASSET PAGE
  // =========================================================

  if (currentPage === "new-asset") {

    return (

      <NewAsset

        // Cancel / Back button
        onCancel={() => {
          setCurrentPage("assets");
        }}


        // Create Asset button
        onCreateAsset={handleCreateAsset}

      />

    );

  }


  // =========================================================
  // ASSET DETAILS PAGE
  // =========================================================

  if (
    currentPage === "asset-details" &&
    selectedAsset
  ) {

    return (

      <AssetDetails

        // VERY IMPORTANT
        // Send the clicked asset to AssetDetails.jsx

        asset={selectedAsset}


        // Back to Assets
        onBackToAssets={() => {
          setCurrentPage("assets");
        }}


        // Dashboard
        onDashboardClick={() => {
          setCurrentPage("dashboard");
        }}

      />

    );

  }


  // =========================================================
  // FALLBACK
  // =========================================================

  return null;

}


export default App; 