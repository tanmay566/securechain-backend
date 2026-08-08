import logo from "../assets/logo.png";

function BrandLogo({ showTagline = false }) {
  return (
    <div className="flex items-center gap-3">

      {/* Logo */}
      <img
        src={logo}
        alt="VITALChain Logo"
        className="w-12 h-12 object-contain"
      />

      {/* Brand Name */}
      <div className="flex flex-col justify-center">

        <span className="text-2xl font-bold tracking-tight text-slate-900">
          VITALChain
        </span>

        {showTagline && (
          <span className="text-xs text-slate-500 font-medium tracking-wide">
            Securing Healthcare Assets
          </span>
        )}

      </div>

    </div>
  );
}

export default BrandLogo;