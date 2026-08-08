
import BrandLogo from "../components/BrandLogo";
import vitalchainLogo from "../assets/vitalchain-logo.png";
import {
  Search,
  Bell,
  Grid2X2,
  Package,
  Stethoscope,
  Filter,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

function Assets({
  assets = [],
  onDashboardClick,
  onAddAssetClick,
  onAssetClick,
}) {
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="w-full h-[68px] bg-white border-b border-slate-200 flex items-center px-5 md:px-7">

        {/* LOGO */}
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


          {/* Assets Active */}
          <button
            className="
              px-5 py-2.5
              rounded-full
              bg-blue-50
              text-blue-600
              text-base
              font-semibold
            "
          >
            Assets
          </button>

        </nav>


        {/* HEADER SEARCH */}
        <div className="flex-1 ml-8 mr-8">

          <div className="relative w-full max-w-[700px]">

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
                transition-all
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/10
              "
            />

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5 shrink-0">

          {/* Notification */}
          <button
            className="
              text-slate-500
              hover:text-blue-600
              hover:scale-110
              transition-all
              duration-200
            "
          >
            <Bell size={21} />
          </button>


          {/* Grid */}
          <button
            className="
              text-slate-500
              hover:text-blue-600
              hover:scale-110
              transition-all
              duration-200
            "
          >
            <Grid2X2 size={20} />
          </button>


          {/* Profile */}
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
              hover:shadow-md
              transition-all
              duration-200
            "
          >
            R
          </button>

        </div>

      </header>


      {/* =========================================================
          MAIN PAGE
      ========================================================= */}
      <main className="w-full px-6 md:px-8 lg:px-10 xl:px-12 py-8">


        {/* =======================================================
            BREADCRUMB
        ======================================================= */}
        <div className="flex items-center gap-2 text-base mb-5">

          <button
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

          <span className="text-blue-600 font-semibold">
            Assets Inventory
          </span>

        </div>


        {/* =======================================================
            PAGE HEADING
        ======================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-7">

          <div>

            <h1
              className="
                text-4xl
                md:text-5xl
                font-bold
                tracking-tight
                text-slate-900
              "
            >
              Assets
            </h1>

            <p className="text-lg text-slate-500 mt-2">
              Manage and monitor all healthcare assets.
            </p>

          </div>


          {/* ADD ASSET BUTTON */}
          <button
            onClick={onAddAssetClick}
            className="
              self-start
              lg:self-center
              bg-blue-600
              hover:bg-blue-700
              active:scale-[0.98]
              text-white
              font-semibold
              text-base
              px-6
              py-3.5
              rounded-xl
              shadow-lg
              shadow-blue-600/20
              transition-all
              duration-200
              hover:-translate-y-0.5
            "
          >
            + Add New Asset
          </button>

        </div>


        {/* =======================================================
            FILTER BAR
        ======================================================= */}
        <div
          className="
            w-full
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-3
            md:p-4
            mb-7
            shadow-sm
          "
        >

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">


            {/* SEARCH */}
            <div className="flex-1 relative">

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
                placeholder="Filter by name, serial..."
                className="
                  w-full
                  h-12
                  pl-12
                  pr-4
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-xl
                  text-base
                  text-slate-700
                  placeholder:text-slate-400
                  outline-none
                  transition
                  focus:bg-white
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                "
              />

            </div>


            {/* CATEGORY */}
            <div className="relative">

              <select
                className="
                  appearance-none
                  w-full
                  lg:w-[210px]
                  h-12
                  pl-4
                  pr-10
                  border
                  border-slate-200
                  rounded-xl
                  bg-white
                  text-base
                  text-slate-700
                  outline-none
                  cursor-pointer
                  transition
                  hover:border-slate-300
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                "
              >
                <option>All Categories</option>
                <option>Vaccines</option>
                <option>Diagnostic Equipment</option>
                <option>Medical Devices</option>
              </select>

              <ChevronDown
                size={18}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  pointer-events-none
                  text-slate-500
                "
              />

            </div>


            {/* STATUS */}
            <div className="relative">

              <select
                className="
                  appearance-none
                  w-full
                  lg:w-[190px]
                  h-12
                  pl-4
                  pr-10
                  border
                  border-slate-200
                  rounded-xl
                  bg-white
                  text-base
                  text-slate-700
                  outline-none
                  cursor-pointer
                  transition
                  hover:border-slate-300
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                "
              >
                <option>All Statuses</option>
                <option>Verified</option>
                <option>In Transit</option>
                <option>Pending</option>
                <option>Delivered</option>
              </select>

              <ChevronDown
                size={18}
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  pointer-events-none
                  text-slate-500
                "
              />

            </div>


            {/* FILTER BUTTON */}
            <button
              className="
                h-12
                w-12
                shrink-0
                flex
                items-center
                justify-center
                border
                border-slate-200
                rounded-xl
                bg-white
                text-slate-600
                hover:bg-blue-50
                hover:text-blue-600
                hover:border-blue-200
                transition-all
                duration-200
              "
            >
              <Filter size={20} />
            </button>

          </div>

        </div>


        {/* =======================================================
            ASSET TABLE
        ======================================================= */}
        <div
          className="
            w-full
            bg-white
            border
            border-slate-200
            rounded-2xl
            shadow-sm
            overflow-hidden
          "
        >

          {/* TABLE HEADER */}
          <div
            className="
              grid
              grid-cols-4
              items-center
              px-7
              py-5
              bg-slate-50
              border-b
              border-slate-200
              text-sm
              font-bold
              text-slate-500
              uppercase
              tracking-wider
            "
          >

            <span>
              Asset Name
            </span>

            <span>
              Asset ID
            </span>

            <span>
              Category
            </span>

            <span>
              Current Location / Status
            </span>

          </div>


          {/* ASSET ROWS */}
          <div className="divide-y divide-slate-100">

            {assets.length === 0 ? (

              <div className="py-16 text-center">

                <Package
                  size={40}
                  className="mx-auto text-slate-300 mb-3"
                />

                <p className="text-lg font-semibold text-slate-600">
                  No assets found
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Add a new healthcare asset to get started.
                </p>

              </div>

            ) : (

              assets.map((asset) => (

                <div
                  key={asset.id}
                  onClick={() => onAssetClick(asset)}
                  className="
                    grid
                    grid-cols-4
                    items-center
                    px-7
                    py-6
                    hover:bg-blue-50/50
                    cursor-pointer
                    transition
                    duration-200
                    group
                  "
                >

                  {/* ASSET NAME */}
                  <div className="flex items-center gap-4">

                    <div
                      className="
                        w-12
                        h-12
                        rounded-xl
                        bg-blue-50
                        flex
                        items-center
                        justify-center
                        group-hover:scale-105
                        group-hover:bg-blue-100
                        transition-all
                        duration-200
                      "
                    >

                      {asset.category === "Vaccines" ? (
                        <Package
                          size={22}
                          className="text-blue-600"
                        />
                      ) : (
                        <Stethoscope
                          size={22}
                          className="text-indigo-600"
                        />
                      )}

                    </div>


                    <div>

                      <p className="text-lg font-semibold text-slate-900">
                        {asset.name}
                      </p>

                      

                    </div>

                  </div>


                  {/* ASSET ID */}
                  <span className="text-base font-medium text-slate-600">
                    #{asset.id}
                  </span>


                  {/* CATEGORY */}
                  <span className="text-base text-slate-600">
                    {asset.category}
                  </span>


                  {/* STATUS / LOCATION */}
                  <div>

                    {asset.status === "Delivered" ? (

                      <span
                        className="
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
                        "
                      >

                        <CheckCircle2
                          size={18}
                          strokeWidth={2.2}
                        />

                        Delivered

                      </span>

                    ) : (

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          px-4
                          py-2
                          rounded-full
                          bg-purple-50
                          text-purple-700
                          font-semibold
                          text-base
                        "
                      >
                        {asset.status}
                      </span>

                    )}

                  </div>

                </div>

              ))

            )}

          </div>

        </div>


        {/* =======================================================
            BOTTOM SPACE
        ======================================================= */}
        <div className="h-12" />

      </main>

    </div>
  );
}

export default Assets;