import React, { useEffect, useState } from "react"
import ICS from "../ICS.jpeg"
import { readContract } from "thirdweb"
import { useSocialTokenContext } from "../context/context"
import { useActiveAccount, useActiveWallet } from "thirdweb/react"

const Balance: React.FC = () => {
  const [balance, setBalance] = useState<number>(0)
  const { ICSContract } = useSocialTokenContext()
  const address = useActiveAccount()?.address
  console.log(address)
  useEffect(() => {
    if (address) {
      const getBalance = async () => {
        const data = await readContract({
          contract: ICSContract,
          method: "function balanceOf(address account) view returns (uint256)",
          params: [address],
        })
        setBalance(Number(data) / 1e18)
      }
      getBalance()
    }

    return () => {}
  }, [])
  return (
    <div className="flex items-center p-1 bg-black h-16 text-white rounded-lg shadow-md">
      <img
        className="w-12 h-12 rounded-full border-2 border-white mr-4"
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
