import React, { useEffect, useState } from "react"
import ICS from "../ICS.jpeg"
import { readContract } from "thirdweb"
import { useSocialTokenContext } from "../context/context"
import { useActiveAccount, useActiveWallet } from "thirdweb/react"

const Balance: React.FC = () => {
  const [balance, setBalance] = useState<number>(0)
  const { ICSContract } = useSocialTokenContext()
  const address = useActiveAccount()?.address
  //  console.log(address)
  useEffect(() => {
    if (address) {
      const getBalance = async () => {
        const data = await readContract({
          contract: ICSContract,
          method: "function balanceOf(address account) view returns (uint256)",
          params: [address],
        })
        setBalance(Number(data) / 1e18)
        console.log(data)
      }
      getBalance()
    }

    return () => {}
  }, [address])
  return (
    <div className="flex items-center p-1 bg-black h-16 text-white rounded-lg shadow-md">
      <img
        className="w-4 h-4 md:h-10 md:w-10 rounded-full border-2 border-white mr-2"
        src={ICS}
        alt="token"
      />
      <div className="flex flex-row">
        <p className="text-md lg:text-xl font-semibold mr-1">ICS:</p>
        <p className="text-xs sm:text-lg lg:text-xl font-400 mt-1 sm:mt-0">
          {balance.toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default Balance
