import React, { useContext, createContext, ReactNode } from "react"
import {
  createThirdwebClient,
  getContract,
  defineChain,
  ThirdwebClient,
} from "thirdweb"
import { createWallet } from "thirdweb/wallets"

const wallets = [createWallet("io.metamask")]

interface SocialTokenContextProps {
  ICSContract: any
  SocialContract: any
  MarketContract: any
  wallets: any
  client: any
  wallet: any
  account: any
}

const SocialTokenContext = createContext<SocialTokenContextProps | undefined>(
  undefined,
)

const client: ThirdwebClient = createThirdwebClient({
  clientId: import.meta.env.VITE_CLIENT_ID as string,
})
const wallet = createWallet("io.metamask")
const account = await wallet.connect({
  client,
})
interface socialTokenContextProviderProps {
  children: ReactNode
}

export const SocialTokenContextProvider = ({
  children,
}: socialTokenContextProviderProps) => {
  const ICSContract = getContract({
    client,
    chain: defineChain(3441006),
    address: import.meta.env.VITE_ICS_CONTRACT_ADDRESS as string,
  })

  const SocialContract = getContract({
    client,
    chain: defineChain(3441006),
    address: import.meta.env.VITE_SOCIAL_CONTRACT_ADDRESS as string,
  })

  const MarketContract = getContract({
    client,
    chain: defineChain(3441006),
    address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as string,
  })

  return (
    <SocialTokenContext.Provider
      value={{
        ICSContract,
        SocialContract,
        MarketContract,
        wallets,
        client,
        wallet,
        account,
      }}
    >
      {children}
    </SocialTokenContext.Provider>
  )
}

export const useSocialTokenContext = () => {
  const context = useContext(SocialTokenContext)
  if (context === undefined) {
    throw new Error(
      "useVotingContext must be used within a SocialTokenContextProvider",
    )
  }
  return context
}
