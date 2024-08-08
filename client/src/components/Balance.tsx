import React, { useState } from "react"
import ICS from "../ICS.jpeg"

const Balance: React.FC = () => {
  const [balance, setBalance] = useState<number>(0)

  return (
    <div className="flex items-center p-1 bg-black border-2 border-white text-white rounded-lg shadow-md">
      <img
        className="w-14 h-14 rounded-full border-2 border-white mr-4"
        src={ICS}
        alt="token"
      />
      <div className="flex flex-row">
        <p className="text-lg font-semibold mr-2">ICS:</p>
        <p className="text-xl font-bold">{balance.toLocaleString()}</p>
      </div>
    </div>
  )
}

export default Balance
