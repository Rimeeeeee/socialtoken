import React, { useContext, createContext, ReactNode } from "react";
import {
  createThirdwebClient,
  getContract,
  defineChain,
  ThirdwebClient,
} from "thirdweb";
import { createWallet } from "thirdweb/wallets";
const wallets = [createWallet("io.metamask")];
interface SocialContextProps {

  contract: any;
  wallets: any;
  client: any;
}

const SocialContext = createContext<SocialContextProps | undefined>(undefined);

const client: ThirdwebClient = createThirdwebClient({
  clientId:import.meta.env.VITE_CONTRACT_ADDRESS as string,
});

interface SocialContextProviderProps {
  children: ReactNode;
}

export const SocialContextProvider = ({
  children,
}: SocialContextProviderProps) => {
  const contract = getContract({
    client,
    chain: defineChain(2442),
    address:import.meta.env.VITE_CONTRACT_ADDRESS as string,
  });

  

  return (
    <SocialContext.Provider
      value={{
      
        contract,
        wallets,
        client,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocialContext = () => {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error(
      "useStateContext must be used within a SocialContextProvider",
    );
  }
  return context;
};