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
  clientId:"89a5e5b847b9dbdf1aa28f3b1363cc9e",
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
    address:"0xbA9489Fb374fC8E241b376fb04c287c29Fa7100d",
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