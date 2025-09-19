import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-12 py-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Personal Finance Tracker</h1>
          <p className="text-lg text-gray-600 mb-6">
            Take control of your finances, wisely.
          </p>
          <p className="text-gray-500 mb-8">
            Track your income & expenses, view insights with interactive charts,
            and make smarter financial decision with Personal Finance Tracker.
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-purple-600 text-white text-lg rounded-lg shadow-md hover:bg-purple-700"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border border-gray-400 text-lg rounded-lg hover:bg-gray-100"
            >
              Login
            </Link>
          </div>

          {/* Support Link */}
          <div className="mt-12 text-sm text-gray-500">
            Need help?{" "}
            <a href="mailto:rreed7050@gmail.com" className="underline">
              Contact Support
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex w-1/2 bg-purple-600 text-white items-center justify-center relative">
          <div className="text-center max-w-md px-6">
            <h2 className="text-2xl font-semibold mb-4">
              Track Your Income & Expenses
            </h2>
            <p className="mb-6 text-gray-200">
              Smart charts & insights help you save more every month.
            </p>
            <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg">
              <p className="font-bold text-xl">Total Balance</p>
              <p className="text-3xl text-purple-600 font-bold mt-2">₹430,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Credit */}
      <div className="w-full py-4 bg-gray-100 flex justify-center">
        <p className="text-gray-800 text-sm md:text-base lg:text-lg font-semibold">
          Designed & Crafted with Passion by{" "}
          <span className="text-purple-600">Pragna Aluru</span>
        </p>
      </div>
    </div>
  );
}
