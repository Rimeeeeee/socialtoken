import React, { useContext, createContext, ReactNode } from "react";
import {
  createThirdwebClient,
  getContract,
  defineChain,
  ThirdwebClient,
} from "thirdweb";
import { createWallet } from "thirdweb/wallets";
const wallets = [createWallet("io.metamask")];
interface MarketplaceContextProps {
 
  contract: any;
  wallets: any;
  client: any;
}

const MarketplaceContext = createContext<MarketplaceContextProps | undefined>(undefined);

const client: ThirdwebClient = createThirdwebClient({
  clientId:"89a5e5b847b9dbdf1aa28f3b1363cc9e",
  //import.meta.env.VITE_CONTRACT_ADDRESS
});

interface MarketplaceContextProviderProps {
  children: ReactNode;
}

export const MarketplaceContextProvider = ({
  children,
}: MarketplaceContextProviderProps) => {
  const contract = getContract({
    client,
    chain: defineChain(2442),
    address:"0xbA9489Fb374fC8E241b376fb04c287c29Fa7100d",
  });

  

  return (
    <MarketplaceContext.Provider
      value={{
      
        contract,
        wallets,
        client,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplaceContext = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error(
      "useStateContext must be used within a MarketplaceContextProvider",
    );
  }
  return context;
};