import { useState } from "react";
import loginImage from "../assets/login-healthcare.jpg";
import vitalchainLogo from "../assets/VITALChainLoginLogo.png";

function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">

      {/* Main Login Container */}
      <div className="w-full max-w-6xl min-h-[680px] bg-white rounded-[28px] shadow-2xl overflow-hidden flex">

        {/* LEFT SIDE */}
        <div className="w-1/2 relative hidden md:block">

          <img
            src={loginImage}
            alt="Healthcare technology"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Blue overlay */}
          <div className="absolute inset-0 bg-blue-900/20"></div>

          {/* Logo */}
          

          {/* Information Card */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Immutable. Verifiable. Secure.
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed">
                Secure healthcare asset tracking with transparent and
                trusted chain-of-custody verification.
              </p>

            </div>
          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-16 py-12">

          <div className="w-full max-w-md">

            {/* VITALChain Logo */}
<div className="flex justify-center mb-8">
  <img
    src={vitalchainLogo}
    alt="VITALChain"
    className="w-[420px] h-auto object-contain"
  />
</div>

            {/* Heading */}
            <div className="mb-8">

              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Welcome back
              </h1>

              <p className="text-gray-500">
                Enter your credentials to access the secure dashboard.
              </p>

            </div>


            {/* Login Form */}
            <form
  className="space-y-5"
  onSubmit={(e) => {
    e.preventDefault();
    onLogin();
  }}
>

              {/* Email */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <div className="relative">

                  <input
                    type="email"
                    placeholder="admin@healthcare.org"
                    className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />

                </div>

              </div>


              {/* Password */}
              <div>

                <div className="flex justify-between items-center mb-2">

                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm text-blue-600 font-medium hover:underline"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>


              {/* Remember Me */}
              <div className="flex items-center gap-2">

                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-gray-600">
                  Remember me for 30 days
                </span>

              </div>


              {/* Login Button */}
              <button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-600/20"
              >
                Sign In to Dashboard →
              </button>

            </form>


            {/* Security Message */}
            <p className="text-center text-xs text-gray-500 mt-6">
              Secure connection to institutional blockchain framework.
            </p>


            {/* Sign Up */}
            <p className="text-center text-sm text-gray-600 mt-8">

              Don't have an account?{" "}

              <button className="text-blue-600 font-semibold hover:underline">
                Create one
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;