import React, { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Grid2X2,
  Copy,
  Send,
  Download,
  Plus,
  ExternalLink,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
} from "lucide-react";

import vitalchainLogo from "../assets/vitalchain-logo.png";  
function Wallet({
  selectedAsset,
  onDashboardClick,
  onAssetsClick,
  onSendClick,
}) {

  // =========================================================
  // TRANSACTIONS
  // =========================================================

  const transactions = [
    {
      type: "Received",
      title: "Asset Registration",
      address: "From: 0xa8b7...3f6b",
      amount: "+₹2,500",
      time: "18 Aug 2026, 9:12 PM",
      positive: true,
    },
    {
      type: "Sent",
      title: "Healthcare Supplier",
      address: "To: 0x7b91...2c4e",
      amount: "-₹1,200",
      time: "18 Aug 2026, 7:45 PM",
      positive: false,
    },
    {
      type: "Received",
      title: "Asset Verification",
      address: "From: 0x4e21...7d8f",
      amount: "+₹500",
      time: "18 Aug 2026, 6:30 PM",
      positive: true,
    },
    {
      type: "Sent",
      title: "Healthcare Service",
      address: "To: 0x6d81...5e7a",
      amount: "-₹300",
      time: "17 Aug 2026, 11:20 PM",
      positive: false,
    },
  ];

  // =========================================================
  // ASSET DATA
  // =========================================================
  // Use the asset selected/created earlier in the order flow.
  // If Wallet is opened directly, restore the last saved asset.

  const getSavedAsset = () => {
    if (typeof window === "undefined") return null;

    const keys = [
      "vitalchainAsset",
      "selectedAsset",
      "assetData",
      "vitalchainSelectedAsset",
    ];

    for (const key of keys) {
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) continue;

        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return parsed.asset || parsed.selectedAsset || parsed;
        }
      } catch (error) {
        console.warn(`Unable to read saved asset from ${key}`, error);
      }
    }

    return null;
  };

  const [assetData, setAssetData] = useState(() => {
    // Always prefer the newest data entered in NewAsset.jsx.
    return getSavedAsset() || selectedAsset || {};
  });

  useEffect(() => {
    const loadLatestAsset = () => {
      const savedAsset = getSavedAsset();

      if (savedAsset) {
        setAssetData(savedAsset);
      } else if (selectedAsset && typeof selectedAsset === "object") {
        setAssetData(selectedAsset);
      }
    };

    loadLatestAsset();

    const handleAssetUpdated = (event) => {
      if (event?.detail && typeof event.detail === "object") {
        setAssetData(event.detail);
      } else {
        loadLatestAsset();
      }
    };

    window.addEventListener(
      "vitalchain:asset-updated",
      handleAssetUpdated
    );

    return () => {
      window.removeEventListener(
        "vitalchain:asset-updated",
        handleAssetUpdated
      );
    };
  }, [selectedAsset]);

  const walletAssetId =
    assetData?.assetId ||
    assetData?.assetID ||
    assetData?.asset_id ||
    assetData?.id ||
    assetData?.formData?.assetId ||
    assetData?.formData?.assetID ||
    "ASSET-ID";

  const walletAssetName =
    assetData?.name ||
    assetData?.assetName ||
    assetData?.vaccineName ||
    assetData?.fullAssetName ||
    assetData?.fullVaccineName ||
    assetData?.formData?.name ||
    assetData?.formData?.assetName ||
    "Healthcare Asset";

  const paymentAmount =
    assetData?.amount ||
    assetData?.paymentAmount ||
    "19,999";

  // =========================================================
  // SEND BUTTON
  // =========================================================

  const handleSendClick = () => {
    if (typeof onSendClick === "function") {
      onSendClick();
    } else {
      console.error("onSendClick is not connected in App.jsx");
    }
  };

  // =========================================================
  // COPY WALLET ADDRESS
  // =========================================================

  const copyWalletAddress = async () => {

    try {

      await navigator.clipboard.writeText(
        "0x71C...8a92"
      );

      console.log("Wallet address copied");

    } catch (error) {

      console.error(
        "Unable to copy wallet address",
        error
      );

    }

  };

  return (

    <div className="min-h-screen w-full bg-slate-50 text-slate-900">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          w-full
          h-[68px]
          bg-white
          border-b
          border-slate-200
          flex
          items-center
          px-5
          md:px-7
        "
      >

        {/* LOGO */}

        <div
          className="
            w-[270px]
            h-[64px]
            shrink-0
            flex
            items-center
          "
        >

          <img
            src={vitalchainLogo}
            alt="VITALChain"
            className="
              h-[166px]
              w-auto
              object-contain
            "
          />

        </div>


        {/* NAVIGATION */}

        <nav
          className="
            flex
            items-center
            gap-2
            ml-8
          "
        >

          <button
            type="button"
            onClick={onDashboardClick}
            className="
              px-5
              py-2.5
              rounded-full
              text-base
              font-medium
              text-slate-600
              hover:bg-blue-50
              hover:text-blue-600
              transition-all
            "
          >
            Dashboard
          </button>


          <button
            type="button"
            onClick={onAssetsClick}
            className="
              px-5
              py-2.5
              rounded-full
              text-base
              font-medium
              text-slate-600
              hover:bg-blue-50
              hover:text-blue-600
              transition-all
            "
          >
            Assets
          </button>

        </nav>


        {/* SEARCH */}

        <div className="flex-1 ml-8 mr-8">

          <div
            className="
              relative
              w-full
              max-w-[700px]
            "
          >

            <Search
              size={20}
              strokeWidth={1.8}
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
              "
            />

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div
          className="
            flex
            items-center
            gap-5
            shrink-0
          "
        >

          <button
            type="button"
            className="
              text-slate-500
              hover:text-blue-600
              transition
            "
          >
            <Bell size={21} />
          </button>


          <button
            type="button"
            className="
              text-slate-500
              hover:text-blue-600
              transition
            "
          >
            <Grid2X2 size={20} />
          </button>


          <button
            type="button"
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
              shadow-md
              shadow-blue-600/20
            "
          >
            R
          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          w-full
          px-6
          md:px-8
          lg:px-10
          xl:px-12
          py-8
        "
      >

        {/* PAGE HEADING */}

        <div className="mb-7">

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              mb-3
            "
          >

            <button
              type="button"
              onClick={onDashboardClick}
              className="
                text-slate-500
                hover:text-blue-600
                transition
              "
            >
              Dashboard
            </button>

            <span className="text-slate-400">
              ›
            </span>

            <span
              className="
                text-blue-600
                font-semibold
              "
            >
              Wallet
            </span>

          </div>


          <h1
            className="
              text-4xl
              md:text-5xl
              font-bold
              tracking-tight
              text-slate-900
            "
          >
            Wallet
          </h1>


          <p
            className="
              text-lg
              text-slate-500
              mt-2
            "
          >
            Manage your wallet, balances and healthcare transactions.
          </p>

        </div>


        {/* =====================================================
            PAYMENT REQUEST
        ===================================================== */}

        {(selectedAsset || assetData?.assetId || assetData?.id) && (

          <div
            className="
              mb-6
              bg-gradient-to-r
              from-blue-50
              to-sky-50
              border
              border-blue-200
              rounded-2xl
              p-5
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-white
                  flex
                  items-center
                  justify-center
                  shadow-sm
                "
              >

                <CreditCard
                  size={23}
                  className="text-blue-600"
                />

              </div>


              <div>

                <p
                  className="
                    text-sm
                    text-blue-600
                    font-semibold
                  "
                >
                  Payment Request
                </p>


                <h3
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                  "
                >
                  {walletAssetName}
                </h3>


                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Asset ID:{" "}
                  {walletAssetId}
                </p>

              </div>

            </div>


            <div
              className="
                text-left
                md:text-right
              "
            >

              <p className="text-xs text-slate-500">
                Amount to Pay
              </p>


              <p
                className="
                  text-2xl
                  font-bold
                  text-blue-600
                "
              >
                ₹ {String(paymentAmount).replace(/^₹\s*/, "")}
              </p>

            </div>

          </div>

        )}


        {/* =====================================================
            WALLET OVERVIEW
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-5
            mb-6
          "
        >

          {/* ===================================================
              TOTAL WALLET BALANCE
          =================================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              bg-gradient-to-br
              from-[#071F4D]
              via-[#0D3374]
              to-[#1557B8]
              p-5
              text-white
              min-h-[175px]
              shadow-[0_12px_30px_rgba(30,64,175,0.16)]
            "
          >

            <div
              className="
                absolute
                -right-16
                -top-16
                h-48
                w-48
                rounded-full
                bg-blue-400/20
                blur-3xl
              "
            />


            <div
              className="
                absolute
                -bottom-20
                -left-10
                h-40
                w-40
                rounded-full
                bg-cyan-400/10
                blur-3xl
              "
            />


            <div
              className="
                relative
                flex
                items-start
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-sm
                    font-medium
                    text-blue-100
                  "
                >
                  Total Wallet Balance
                </p>


                <p
                  className="
                    mt-1
                    text-xs
                    text-blue-200
                  "
                >
                  Available for healthcare transactions
                </p>

              </div>


              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/10
                  border
                  border-white/10
                "
              >

                <span
                  className="
                    text-xl
                    font-semibold
                  "
                >
                  ₹
                </span>

              </div>

            </div>


            <div className="relative mt-6">

              <p
                className="
                  text-3xl
                  md:text-[36px]
                  font-bold
                  tracking-tight
                "
              >
                ₹12,458.75
              </p>

            </div>


            <div
              className="
                relative
                mt-3
                flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  rounded-full
                  bg-emerald-400/15
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-emerald-300
                  border
                  border-emerald-300/10
                "
              >
                ↑ 2.45%
              </span>


              <span
                className="
                  text-xs
                  text-blue-200
                "
              >
                from last month
              </span>

            </div>


            <div
              className="
                absolute
                bottom-5
                right-5
                flex
                h-16
                items-end
                gap-1.5
                opacity-70
              "
            >

              {[22, 34, 29, 45, 39, 58, 48, 68].map(
                (height, index) => (

                  <div
                    key={index}
                    style={{
                      height: `${height}px`,
                    }}
                    className="
                      w-2
                      rounded-t
                      bg-blue-200/60
                    "
                  />

                )
              )}

            </div>

          </div>


          {/* ===================================================
              CONNECTED WALLET
          =================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              min-h-[175px]
              shadow-[0_8px_25px_rgba(15,23,42,0.05)]
            "
          >

            <div
              className="
                flex
                items-center
                justify-end
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-emerald-50
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-emerald-600
                "
              >

                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-emerald-500
                  "
                />

                Connected

              </div>

            </div>


            {/* WALLET ADDRESS */}

            <div
              className="
                mt-4
                rounded-xl
                border
                border-slate-100
                bg-slate-50
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <p
                    className="
                      text-xs
                      font-medium
                      text-slate-400
                    "
                  >
                    Wallet Address
                  </p>


                  <p
                    className="
                      mt-1
                      text-base
                      font-semibold
                      text-slate-900
                    "
                  >
                    0x71C...8a92
                  </p>

                </div>


                <button
                  type="button"
                  onClick={copyWalletAddress}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    border
                    border-slate-200
                    text-slate-500
                    hover:bg-blue-50
                    hover:text-blue-600
                    hover:border-blue-200
                    transition
                  "
                  title="Copy wallet address"
                >

                  <Copy size={16} />

                </button>

              </div>

            </div>


            {/* WALLET INFORMATION */}

            <div
              className="
                mt-4
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-3
              "
            >

              <WalletInfo
                title="Network"
                value="Polygon Amoy"
              />

              <WalletInfo
                title="Wallet Type"
                value="MetaMask"
              />

              <WalletInfo
                title="Connected At"
                value="18 Aug 2026"
              />

            </div>

          </div>

        </div>


        {/* =====================================================
            ACTION BUTTONS
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-2
            xl:grid-cols-4
            gap-4
            mb-6
          "
        >

          {/* SEND */}

          <WalletAction
            icon={<Send size={21} />}
            title="Send"
            subtitle="Send tokens"
            onClick={handleSendClick}
          />


          {/* RECEIVE */}

          <WalletAction
            icon={<Download size={21} />}
            title="Receive"
            subtitle="Receive tokens"
          />


          {/* ADD FUNDS */}

          <WalletAction
            icon={<Plus size={21} />}
            title="Add Funds"
            subtitle="Add funds to wallet"
          />


          {/* EXPLORER */}

          <WalletAction
            icon={<ExternalLink size={21} />}
            title="View on Explorer"
            subtitle="View wallet on explorer"
          />

        </div>


        {/* =====================================================
            BALANCES + TRANSACTIONS
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-5
          "
        >

          {/* TOKEN BALANCES */}

          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              overflow-hidden
              shadow-sm
            "
          >

            <div
              className="
                px-6
                py-5
                border-b
                border-slate-100
              "
            >

              <h2
                className="
                  font-semibold
                  text-slate-800
                "
              >
                Token Balances
              </h2>


              <p
                className="
                  text-sm
                  text-slate-400
                  mt-1
                "
              >
                Available wallet assets
              </p>

            </div>


            <TokenRow
              symbol="US"
              color="bg-blue-100 text-blue-600"
              name="USDC"
              subtitle="USD Coin"
              amount="8,250.75 USDC"
              value="₹8,250.75"
            />


            <TokenRow
              symbol="M"
              color="bg-purple-100 text-purple-600"
              name="MATIC"
              subtitle="Polygon"
              amount="1,250.30 MATIC"
              value="₹1,875.45"
            />


            <TokenRow
              symbol="T"
              color="bg-green-100 text-green-600"
              name="USDT"
              subtitle="Tether USD"
              amount="1,500.00 USDT"
              value="₹1,500.00"
            />


            <TokenRow
              symbol="Ξ"
              color="bg-slate-100 text-slate-600"
              name="ETH"
              subtitle="Ethereum"
              amount="0.245 ETH"
              value="₹832.55"
            />

          </div>


          {/* RECENT TRANSACTIONS */}

          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              overflow-hidden
              shadow-sm
            "
          >

            <div
              className="
                px-6
                py-5
                border-b
                border-slate-100
                flex
                justify-between
              "
            >

              <div>

                <h2
                  className="
                    font-semibold
                    text-slate-800
                  "
                >
                  Recent Transactions
                </h2>


                <p
                  className="
                    text-sm
                    text-slate-400
                    mt-1
                  "
                >
                  Recent healthcare transactions
                </p>

              </div>


              <button
                type="button"
                className="
                  text-sm
                  text-blue-600
                  font-medium
                  hover:text-blue-700
                "
              >
                View All
              </button>

            </div>


            {transactions.map(
              (transaction, index) => (

                <div
                  key={index}
                  className="
                    flex
                    items-center
                    justify-between
                    px-6
                    py-5
                    border-b
                    border-slate-100
                    hover:bg-slate-50/70
                    transition
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className={`
                        w-10
                        h-10
                        rounded-full
                        flex
                        items-center
                        justify-center
                        ${
                          transaction.positive
                            ? "bg-blue-50 text-blue-600"
                            : "bg-purple-50 text-purple-600"
                        }
                      `}
                    >

                      {transaction.positive ? (
                        <ArrowDownLeft size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}

                    </div>


                    <div>

                      <p
                        className="
                          font-medium
                          text-sm
                          text-slate-800
                        "
                      >
                        {transaction.type}
                      </p>


                      <p
                        className="
                          text-xs
                          text-slate-500
                          mt-1
                        "
                      >
                        {transaction.title}
                      </p>


                      <p
                        className="
                          text-xs
                          text-slate-400
                        "
                      >
                        {transaction.address}
                      </p>

                    </div>

                  </div>


                  <div className="text-right">

                    <p
                      className={`
                        font-semibold
                        text-sm
                        ${
                          transaction.positive
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      `}
                    >
                      {transaction.amount}
                    </p>


                    <p
                      className="
                        text-xs
                        text-slate-400
                        mt-1
                      "
                    >
                      {transaction.time}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </main>

    </div>

  );
}


/* =========================================================
   WALLET ACTION
========================================================= */

function WalletAction({
  icon,
  title,
  subtitle,
  onClick,
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        px-5
        py-4
        flex
        items-center
        gap-4
        text-left
        hover:border-blue-300
        hover:shadow-md
        hover:-translate-y-0.5
        transition-all
        duration-200
        cursor-pointer
        w-full
      "
    >

      <div
        className="
          w-11
          h-11
          rounded-xl
          bg-blue-50
          text-blue-600
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        {icon}
      </div>


      <div>

        <p
          className="
            font-semibold
            text-sm
            text-slate-800
          "
        >
          {title}
        </p>


        <p
          className="
            text-xs
            text-slate-400
            mt-1
          "
        >
          {subtitle}
        </p>

      </div>

    </button>

  );
}


/* =========================================================
   WALLET INFO
========================================================= */

function WalletInfo({
  title,
  value,
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-slate-100
        bg-slate-50/70
        p-3
      "
    >

      <p
        className="
          text-xs
          text-slate-400
        "
      >
        {title}
      </p>


      <p
        className="
          mt-2
          text-sm
          font-semibold
          text-slate-900
        "
      >
        {value}
      </p>

    </div>

  );
}


/* =========================================================
   TOKEN ROW
========================================================= */

function TokenRow({
  symbol,
  color,
  name,
  subtitle,
  amount,
  value,
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        px-6
        py-5
        border-b
        border-slate-100
        hover:bg-slate-50/70
        transition
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <div
          className={`
            w-10
            h-10
            rounded-full
            flex
            items-center
            justify-center
            text-xs
            font-bold
            ${color}
          `}
        >
          {symbol}
        </div>


        <div>

          <p
            className="
              font-medium
              text-sm
              text-slate-800
            "
          >
            {name}
          </p>


          <p
            className="
              text-xs
              text-slate-400
            "
          >
            {subtitle}
          </p>

        </div>

      </div>


      <div className="text-right">

        <p
          className="
            text-sm
            font-semibold
            text-slate-700
          "
        >
          {amount}
        </p>


        <p
          className="
            text-xs
            text-slate-400
            mt-1
          "
        >
          {value}
        </p>

      </div>

    </div>

  );
}


export default Wallet;