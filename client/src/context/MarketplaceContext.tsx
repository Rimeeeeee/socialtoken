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
  clientId:import.meta.env.VITE_CONTRACT_ADDRESS as string,
 
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
    address:import.meta.env.VITE_CONTRACT_ADDRESS as string,
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