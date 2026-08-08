import React, { useState } from "react";
import vitalchainLogo from "../assets/vitalchain-logo.png";

import {
  Package,
  Truck,
  AlertTriangle,
  Activity,
  Search,
  Bell,
  Grid3X3,
  ShieldCheck,
  WifiOff,
  Info,
  UserRound,
} from "lucide-react";



import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";

// ======================================================
// DASHBOARD DATA
// ======================================================

const assetGrowth = [
  { value: 18 },
  { value: 28 },
  { value: 40 },
  { value: 52 },
  { value: 65 },
  { value: 78 },
];

const shipmentGrowth = [
  { value: 20 },
  { value: 30 },
  { value: 26 },
  { value: 45 },
  { value: 58 },
  { value: 64 },
];

const alertGrowth = [
  { value: 12 },
  { value: 20 },
  { value: 18 },
  { value: 30 },
  { value: 38 },
  { value: 48 },
];

const healthGrowth = [
  { value: 70 },
  { value: 75 },
  { value: 78 },
  { value: 82 },
  { value: 90 },
  { value: 96 },
];

const assetDistribution = [
  { name: "Vaccines", value: 5200 },
  { name: "Organs", value: 4150 },
  { name: "Blood", value: 3100 },
];

const assetStatus = [
  { name: "Verified", value: 65 },
  { name: "In Transit", value: 20 },
  { name: "Pending", value: 10 },
  { name: "Delivered", value: 5 },
];

// ======================================================
// MINI BAR GRAPH
// ======================================================

function MiniGraph({ data, color }) {
  return (
    <div className="h-12 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={6}>
          <Bar
            dataKey="value"
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  title,
  value,
  change,
  changeText,
  icon: Icon,
  iconBg,
  iconColor,
  graphData,
  graphColor,
  negative,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">

      {/* Top section */}
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-slate-900 mt-2 tracking-tight">
            {value}
          </h2>
        </div>

        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon size={23} className={iconColor} />
        </div>

      </div>

      {/* Change */}
      <div
        className={`text-sm font-medium mt-3 ${
          negative ? "text-red-500" : "text-emerald-600"
        }`}
      >
        {change} {changeText}
      </div>

      {/* Graph */}
      <MiniGraph
        data={graphData}
        color={graphColor}
      />

    </div>
  );
}

// ======================================================
// DASHBOARD
// ======================================================

function Dashboard({ onAssetsClick }) {
    const [activeAssetIndex, setActiveAssetIndex] = useState(null);
const [activeStatusIndex, setActiveStatusIndex] = useState(null);

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">

      {/* ==================================================
          TOP NAVBAR
      ================================================== */}

      <header className="h-[72px] bg-white border-b border-slate-200 flex items-center px-6 lg:px-8 gap-6 sticky top-0 z-20">

        {/* VITALChain Logo */}
<div className="w-[270px] h-[64px] shrink-0 flex items-center">
  <img
    src={vitalchainLogo}
    alt="VITALChain"
    className="h-[168px] w-auto object-contain"
  />
</div>


        {/* Navigation */}

        <nav className="flex items-center gap-2">

          <button className="px-5 py-2.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
            Dashboard
          </button>

          <button
  onClick={onAssetsClick}
  className="px-5 py-2.5 rounded-full text-slate-600 hover:bg-slate-100 text-sm font-medium transition"
>
  Assets
</button>

        </nav>


        {/* Search */}

        <div className="flex-1 ml-2">

          <div className="relative max-w-[900px]">

            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search assets, shipments..."
              className="w-full h-11 pl-11 pr-4 border border-slate-200 rounded-xl text-sm outline-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
            />

          </div>

        </div>


        {/* Right controls */}

        <div className="flex items-center gap-5 ml-auto">

          {/* Notification */}

          <button className="text-slate-500 hover:text-blue-600 transition">
            <Bell size={21} />
          </button>

          {/* Grid */}

          <button className="text-slate-500 hover:text-blue-600 transition">
            <Grid3X3 size={20} />
          </button>

          {/* Profile */}

          <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm hover:shadow-md transition">
            <UserRound size={20} />
          </button>

        </div>

      </header>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="w-full px-6 lg:px-10 xl:px-12 py-8">

        {/* ==================================================
            BEAUTIFUL DASHBOARD HEADING
        ================================================== */}

        <div className="mb-8">

          <div className="flex items-center gap-3 mb-2">

            <div className="w-1.5 h-9 bg-blue-600 rounded-full"></div>

            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>

          </div>

          <p className="ml-4 text-base lg:text-lg text-slate-500">
            Monitor your healthcare assets, shipments, alerts and overall
            system health.
          </p>

        </div>


        {/* ==================================================
            STAT CARDS
        ================================================== */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">

          <StatCard
            title="Total Assets"
            value="12,450"
            change="↗ 4.2%"
            changeText="vs last month"
            icon={Package}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            graphData={assetGrowth}
            graphColor="#6b8edb"
          />


          <StatCard
            title="Active Shipments"
            value="3,892"
            change="↗ 1.8%"
            changeText="vs last month"
            icon={Truck}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            graphData={shipmentGrowth}
            graphColor="#b99af5"
          />


          <StatCard
            title="Active Alerts"
            value="45"
            change="↗ 12.5%"
            changeText="vs last month"
            icon={AlertTriangle}
            iconBg="bg-red-50"
            iconColor="text-red-500"
            graphData={alertGrowth}
            graphColor="#d97878"
            negative
          />


          <StatCard
            title="System Health"
            value="99.9%"
            change="✓"
            changeText="All systems operational"
            icon={Activity}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-500"
            graphData={healthGrowth}
            graphColor="#65cdb0"
          />

        </section>


        {/* ==================================================
            LOWER DASHBOARD
        ================================================== */}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-6">

          {/* ==================================================
              ASSET DISTRIBUTION
          ================================================== */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[440px]">

            <h2 className="text-lg font-bold text-slate-900">
              Asset Distribution
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Current healthcare asset breakdown
            </p>


            {/* Chart */}

            <div className="relative h-72 mt-5">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                 <Pie
  data={assetDistribution}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  innerRadius={65}
  outerRadius={100}
  paddingAngle={3}
  animationBegin={0}
  animationDuration={1000}
  animationEasing="ease-out"
  activeIndex={activeAssetIndex}
  activeShape={(props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.15))",
            cursor: "pointer",
          }}
        />
      </g>
    );
  }}
  onMouseEnter={(_, index) => setActiveAssetIndex(index)}
  onMouseLeave={() => setActiveAssetIndex(null)}
>

                    <Cell fill="#2563eb" />
                    <Cell fill="#38bdf8" />
                    <Cell fill="#818cf8" />

                  </Pie>

                </PieChart>

              </ResponsiveContainer>


              {/* PERFECT CENTER TEXT */}

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                <div className="text-center">

                  <p className="text-4xl font-bold text-slate-900 leading-none">
                    12.4K
                  </p>

                  <p className="text-sm font-semibold text-slate-500 mt-2">
                    TOTAL ASSETS
                  </p>

                </div>

              </div>

            </div>


            {/* Legend */}

            <div className="grid grid-cols-3 gap-4 mt-4">

              <div>
                <p className="text-base font-semibold text-slate-700">
                  <span className="text-blue-600">●</span> Vaccines
                </p>

                <p className="text-base font-bold text-slate-900 mt-1 ml-4">
                  5,200
                </p>
              </div>


              <div>
                <p className="text-base font-semibold text-slate-700">
                  <span className="text-sky-400">●</span> Organs
                </p>

                <p className="text-base font-bold text-slate-900 mt-1 ml-4">
                  4,150
                </p>
              </div>


              <div>
                <p className="text-base font-semibold text-slate-700">
                  <span className="text-indigo-400">●</span> Blood
                </p>

                <p className="text-base font-bold text-slate-900 mt-1 ml-4">
                  3,100
                </p>
              </div>

            </div>

          </div>


          {/* ==================================================
              ASSET STATUS
          ================================================== */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[440px]">

            <h2 className="text-lg font-bold text-slate-900">
              Asset Status
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Real-time status of tracked assets
            </p>


            {/* Chart */}

            <div className="relative h-72 mt-5">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
  data={assetStatus}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  innerRadius={65}
  outerRadius={100}
  paddingAngle={3}
  animationBegin={200}
  animationDuration={1200}
  animationEasing="ease-out"
  activeIndex={activeStatusIndex}
  activeShape={(props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.15))",
            cursor: "pointer",
          }}
        />
      </g>
    );
  }}
  onMouseEnter={(_, index) => setActiveStatusIndex(index)}
  onMouseLeave={() => setActiveStatusIndex(null)}
>

                    <Cell fill="#10b981" />
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#fbbf24" />
                    <Cell fill="#f43f5e" />

                  </Pie>

                </PieChart>

              </ResponsiveContainer>


              {/* CENTER CONTENT */}

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

                <div className="text-center">

                  <ShieldCheck
                    size={28}
                    className="mx-auto text-emerald-500 mb-2"
                  />

                  <p className="text-sm font-semibold text-slate-500">
                    Status Mix
                  </p>

                </div>

              </div>

            </div>


            {/* Status Legend */}

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">

              <div className="flex items-center justify-between text-base">
                <span className="font-semibold text-slate-700">
                  <span className="text-emerald-500">●</span> Verified
                </span>

                <span className="font-bold text-slate-900">
                  65%
                </span>
              </div>


              <div className="flex items-center justify-between text-base">
                <span className="font-semibold text-slate-700">
                  <span className="text-purple-500">●</span> In Transit
                </span>

                <span className="font-bold text-slate-900">
                  20%
                </span>
              </div>


              <div className="flex items-center justify-between text-base">
                <span className="font-semibold text-slate-700">
                  <span className="text-yellow-500">●</span> Pending
                </span>

                <span className="font-bold text-slate-900">
                  10%
                </span>
              </div>


              <div className="flex items-center justify-between text-base">
                <span className="font-semibold text-slate-700">
                  <span className="text-red-500">●</span> Delivered
                </span>

                <span className="font-bold text-slate-900">
                  5%
                </span>
              </div>

            </div>

          </div>


          {/* ==================================================
              ALERT SUMMARY
          ================================================== */}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[440px]">

            <div className="flex justify-between items-center">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Alert Summary
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Recent system notifications
                </p>
              </div>

              <button className="text-sm text-blue-600 font-semibold hover:text-blue-700">
                View All
              </button>

            </div>


            <div className="mt-5 space-y-3">


              {/* ALERT 1 */}

              <div className="border border-red-100 bg-red-50/50 rounded-xl p-4 hover:shadow-sm transition">

                <div className="flex gap-3">

                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">

                    <ShieldCheck
                      size={19}
                      className="text-red-500"
                    />

                  </div>


                  <div className="flex-1">

                    <div className="flex justify-between gap-2">

                      <p className="text-base font-bold text-slate-800">
                        Unauthorized Access
                      </p>

                      <span className="text-xs text-red-600 font-bold">
                        CRITICAL
                      </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      Multiple failed logins from IP...
                    </p>

                    <p className="text-xs text-slate-400 mt-2">
                      ◷ 2 mins ago
                    </p>

                  </div>

                </div>

              </div>


              {/* ALERT 2 */}

              <div className="border border-orange-100 bg-orange-50/50 rounded-xl p-4 hover:shadow-sm transition">

                <div className="flex gap-3">

                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">

                    <Activity
                      size={19}
                      className="text-orange-500"
                    />

                  </div>


                  <div className="flex-1">

                    <div className="flex justify-between gap-2">

                      <p className="text-base font-bold text-slate-800">
                        Server Temp High
                      </p>

                      <span className="text-xs text-orange-600 font-bold">
                        HIGH
                      </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      Rack B-04 exceeding normal...
                    </p>

                    <p className="text-xs text-slate-400 mt-2">
                      ◷ 15 mins ago
                    </p>

                  </div>

                </div>

              </div>


              {/* ALERT 3 */}

              <div className="border border-yellow-100 bg-yellow-50/50 rounded-xl p-4 hover:shadow-sm transition">

                <div className="flex gap-3">

                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">

                    <WifiOff
                      size={19}
                      className="text-yellow-600"
                    />

                  </div>


                  <div className="flex-1">

                    <div className="flex justify-between gap-2">

                      <p className="text-base font-bold text-slate-800">
                        Connection Lost
                      </p>

                      <span className="text-xs text-yellow-600 font-bold">
                        MEDIUM
                      </span>

                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      Sensor Node 45 disconnected...
                    </p>

                    <p className="text-xs text-slate-400 mt-2">
                      ◷ 1 hour ago
                    </p>

                  </div>

                </div>

              </div>


              {/* ALERT 4 */}

              <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 hover:shadow-sm transition">

                <div className="flex gap-3">

                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">

                    <Info
                      size={19}
                      className="text-blue-500"
                    />

                  </div>


                  <div className="flex-1">

                    <p className="text-base font-bold text-slate-800">
                      Firmware Update
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Low priority system update available
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;