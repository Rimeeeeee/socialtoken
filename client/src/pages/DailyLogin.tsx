import React from "react"

const DailyLogin = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black text-white">
      <div className="text-center p-6 bg-black border-2 border-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">
          Get Your Daily Tokens Here!!
        </h2>
        <p className="text-lg mb-6 text-red-600">
          ⚠️ Warning: This will only work if you haven't collected tokens in the
          last 24 hours.
        </p>
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full">
          Daily Check-in!
        </button>
      </div>
    </div>
  )
}

export default DailyLogin
