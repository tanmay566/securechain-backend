import React from "react";
import { CheckCircle2, ShieldCheck, Link2, ArrowRight, ArrowLeft, UserRound, Building2, PackageCheck, Hash, Activity, Search, Bell, Grid2X2 } from "lucide-react";
import vitalchainLogo from "../assets/vitalchain-logo.png";

const fallback = {
  orderId:"VTC-ORD-2026-0081", assetName:"Demo Vaccine", assetId:"ASSET-ID-001",
  batchNumber:"DEMO-BATCH-001", manufacturer:"Demo", quantity:500,
  amount:19999, recipient:"0x7A3B...91F2", network:"Polygon Amoy Testnet",
  paymentToken:"USDC"
};

export default function ConfirmOrder({selectedAsset={}, paymentData={}, onBack, onConfirm, onDashboardClick, onAssetsClick}) {
  const a={...fallback,...selectedAsset,...paymentData};
  const name=a.assetName||a.vaccineName||a.name||"Healthcare Asset";
  const id=a.assetId||a.assetID||a.id||"ASSET-ID-001";
  const amount=Number(a.amount||0).toLocaleString("en-IN");
  const confirm = () => {
    const confirmedAsset = {
      ...a,

      // Preserve the exact values from the admin form.
      name: a.name || name,
      assetName: name,
      assetId: id,
      id: a.id || id,

      // Preserve all remaining form fields unchanged.
      batchNumber: a.batchNumber || "",
      manufacturer: a.manufacturer || "",
      quantity: a.quantity || "",
      category: a.category || "Vaccines",

      // Registration state.
      status: a.status || "Delivered",
      registrationStatus: "Registered",
    };

    // App.jsx handles the actual registration, list update,
    // localStorage persistence and redirect to Assets.
    if (typeof onConfirm === "function") {
      onConfirm(confirmedAsset);
      return;
    }

    // Safe fallback if ConfirmOrder is rendered by itself.
    localStorage.setItem(
      "vitalchainConfirmedOrder",
      JSON.stringify(confirmedAsset)
    );
  };

  return <div className="min-h-screen bg-[#f6f9fc] text-[#0b1736]">
    {/* HEADER — same style as Wallet / Assets pages */}
    <header className="w-full h-[88px] bg-white border-b border-slate-200 flex items-center px-6 lg:px-10">
      {/* VITALChain Logo */}
      <div className="w-[330px] shrink-0 flex items-center">
        <img
          src={vitalchainLogo}
          alt="VITALChain"
          className="h-[72px] w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => {
            if (typeof onDashboardClick === "function") onDashboardClick();
          }}
          className="px-7 py-3 rounded-full text-[17px] font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
        >
          Dashboard
        </button>

        <button
          type="button"
          onClick={() => {
            if (typeof onAssetsClick === "function") onAssetsClick();
          }}
          className="px-7 py-3 rounded-full text-[17px] font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
        >
          Assets
        </button>
      </nav>

      {/* Search */}
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

      {/* Right side */}
      <div className="flex items-center gap-7 shrink-0">
        <button
          type="button"
          aria-label="Notifications"
          className="text-slate-500 hover:text-blue-600 transition"
        >
          <Bell size={25} />
        </button>

        <button
          type="button"
          aria-label="Applications"
          className="text-slate-500 hover:text-blue-600 transition"
        >
          <Grid2X2 size={24} />
        </button>

        <button
          type="button"
          aria-label="Profile"
          className="w-16 h-16 rounded-full bg-blue-600 text-white text-lg font-semibold flex items-center justify-center shadow-sm"
        >
          R
        </button>
      </div>
    </header>

    <main className="mx-auto max-w-[1380px] px-5 py-7 lg:px-8">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="grid grid-cols-3 items-center gap-3">
          <Step n="✓" title="1. Connect Wallet" sub="Wallet connected successfully" done/>
          <Step n="✓" title="2. Authorize Payment" sub="Payment authorized successfully" done/>
          <Step n="3" title="3. Confirm Order" sub="Verify and register the asset" active/>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-1">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-blue-50/40 px-7 py-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><PackageCheck size={25}/></div>
            <div><h1 className="text-2xl font-bold">Confirm & Register Asset</h1>
            <p className="mt-1 text-sm text-slate-500">Verify the healthcare asset before it is permanently registered on VITALChain.</p></div>
          </header>

          <div className="p-7">
            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
                <h2 className="font-bold">Healthcare Asset Details</h2>
                <div className="flex gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">✓ Payment Verified</span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">✓ Blockchain Ready</span>
                </div>
              </div>
              <div className="grid gap-4 p-5 md:grid-cols-2">
                <Info label="Order ID" value={a.orderId} icon={<Hash size={18}/>} tone="slate"/>
                <Info label="Asset / Vaccine" value={name} icon={<PackageCheck size={18}/>} tone="blue"/>
                <Info label="Asset ID" value={id} icon={<Hash size={18}/>} tone="indigo" blue/>
                <Info label="Batch Number" value={a.batchNumber||"Not provided"} icon={<Hash size={18}/>} tone="violet"/>
                <Info label="Manufacturer" value={a.manufacturer||"Not provided"} icon={<Building2 size={18}/>} tone="emerald"/>
                <Info label="Quantity" value={a.quantity||"—"} icon={<Activity size={18}/>} tone="cyan"/>
                <Info label="Payment" value={"₹ "+amount} icon={<ShieldCheck size={18}/>} tone="blue" blue/>
                <Info label="Network" value={a.network||"Polygon Amoy Testnet"} icon={<Link2 size={18}/>} tone="violet" purple/>
              </div>
            </div>

            <div className="mb-6 rounded-xl border border-slate-200 p-5">
              <div className="mb-3 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><UserRound size={18}/></div>
              <div><p className="font-semibold">Payment Recipient</p><p className="text-xs text-slate-500">Verified destination of the authorized payment</p></div></div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span className="font-mono text-sm font-semibold">{a.recipient||"0x7A3B...91F2"}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Verified</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={onBack} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"><ArrowLeft size={18}/>Back</button>
              <button onClick={confirm} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg active:translate-y-0 active:scale-[0.99]"><ShieldCheck size={19}/>Confirm & Register Asset<ArrowRight size={18}/></button>
            </div>
            <p className="mt-3 text-center text-xs text-slate-500">By continuing, you confirm that the asset information is accurate and ready for registration.</p>
          </div>
        </section>
      </div>
    </main>
    <footer className="border-t border-slate-200 bg-white py-5 text-center text-sm text-slate-500">VITALChain • Securing Healthcare Assets • Verified Supply Chain</footer>
  </div>;
}

function Step({n,title,sub,done,active}) {
  return <div className="flex items-center gap-3"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${done?"bg-emerald-500 text-white":active?"bg-blue-600 text-white":"bg-slate-100 text-slate-500"}`}>{done?<CheckCircle2 size={21}/>:n}</div><div><p className={`text-sm font-bold ${done?"text-emerald-600":active?"text-blue-600":"text-slate-500"}`}>{title}</p><p className="text-xs text-slate-500">{sub}</p></div></div>;
}
function Info({icon,label,value,blue,purple,tone="slate"}) {
  const tones = {
    slate: "bg-slate-50 text-slate-600 ring-slate-200",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100",
  };

  return (
    <div className="group relative min-h-[92px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="flex h-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${tones[tone] || tones.slate} transition-transform duration-200 group-hover:scale-105`}>
            {icon}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
              {label}
            </p>
            <p className="mt-1 truncate text-[15px] font-semibold text-slate-700">
              {label === "Payment" ? "Healthcare asset payment" : label === "Network" ? "Blockchain network" : "Verified information"}
            </p>
          </div>
        </div>

        <div className={`max-w-[48%] text-right text-[16px] font-bold ${purple ? "text-purple-600" : blue ? "text-blue-600" : "text-slate-900"}`}>
          {value}
        </div>
      </div>
    </div>
  );
}