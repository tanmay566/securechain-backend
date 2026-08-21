import {
  ShieldCheck,
  Syringe,
  LockKeyhole,
} from "lucide-react";

function SecurePayment({
  assetName,
  assetId,
  amount = "19,999",
  onPayNow,
}) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center gap-3 mb-7">

        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
          <ShieldCheck
            size={23}
            className="text-emerald-600"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Secure Payment
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            X402 enabled payment endpoints
          </p>
        </div>

      </div>


      {/* =====================================================
          PAYMENT INFORMATION
      ===================================================== */}

      <div className="
        border
        border-emerald-100
        bg-emerald-50/20
        rounded-xl
        p-6
      ">

        <div className="
          grid
          grid-cols-1
          md:grid-cols-4
          items-center
        ">


          {/* =================================================
              ASSET NAME
          ================================================= */}

          <div className="
            px-3
            md:px-5
            py-3
            md:border-r
            border-emerald-100
          ">

            <p className="text-sm font-medium text-slate-500 mb-3">
              Vaccine Name
            </p>

            <div className="flex items-center gap-3">

              <div className="
                w-10
                h-10
                rounded-xl
                bg-blue-50
                flex
                items-center
                justify-center
                shrink-0
              ">

                <Syringe
                  size={20}
                  className="text-blue-600"
                />

              </div>

              <span className="
                text-lg
                font-bold
                text-slate-900
                break-words
              ">
                {assetName || "Enter Asset Name"}
              </span>

            </div>

          </div>


          {/* =================================================
              ASSET ID
          ================================================= */}

          <div className="
            px-3
            md:px-5
            py-3
            md:border-r
            border-emerald-100
          ">

            <p className="text-sm font-medium text-slate-500 mb-3">
              Vaccine ID
            </p>

            <div className="flex items-center gap-3">

              <div className="
                w-10
                h-10
                rounded-xl
                bg-blue-50
                flex
                items-center
                justify-center
                shrink-0
              ">

                <span className="
                  text-blue-600
                  font-bold
                  text-sm
                ">
                  ID
                </span>

              </div>

              <span className="
                text-lg
                font-bold
                text-slate-900
                break-all
              ">
                {assetId || "Enter Asset ID"}
              </span>

            </div>

          </div>


          {/* =================================================
              TOTAL AMOUNT
          ================================================= */}

          <div className="
            px-3
            md:px-5
            py-3
            md:border-r
            border-emerald-100
          ">

            <p className="text-sm font-medium text-slate-500 mb-3">
              Total Amount
            </p>

            <div className="flex items-center gap-3">

              <div className="
                w-10
                h-10
                rounded-xl
                bg-emerald-50
                flex
                items-center
                justify-center
                shrink-0
              ">

                <span className="
                  text-xl
                  font-bold
                  text-emerald-600
                ">
                  ₹
                </span>

              </div>

              <span className="
                text-xl
                font-bold
                text-slate-900
              ">
                ₹ {amount}
              </span>

            </div>

          </div>


          {/* =================================================
              PAY NOW
          ================================================= */}

          <div className="
            px-3
            md:px-5
            py-3
          ">

            <button
              type="button"
              onClick={onPayNow}
              className="
                w-full
                h-[52px]
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                active:bg-blue-800
                text-white
                font-bold
                text-base
                flex
                items-center
                justify-center
                gap-2
                shadow-md
                shadow-blue-600/20
                transition-all
                duration-200
                hover:shadow-lg
                hover:shadow-blue-600/25
              "
            >

              <LockKeyhole size={19} />

              <span>
                Pay Now
              </span>

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default SecurePayment;