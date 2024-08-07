import React, { useContext, createContext, ReactNode } from "react";
import {
  createThirdwebClient,
  getContract,
  defineChain,
  ThirdwebClient,
} from "thirdweb";
import { createWallet } from "thirdweb/wallets";

const wallets = [createWallet("io.metamask")];

interface SocialTokenContextProps {
  contract1: any;
  contract2: any;
  contract3: any;
  wallets: any;
  client: any;
}

const SocialTokenContext = createContext<SocialTokenContextProps | undefined>(undefined);

const client: ThirdwebClient = createThirdwebClient({
  clientId: import.meta.env.VITE_CLIENT_ID as string,
});

interface socialTokenContextProviderProps {
  children: ReactNode;
}

export const SocialTokenContextProvider = ({
  children,
}: socialTokenContextProviderProps) => {
  const contract1 = getContract({
    client,
    chain: defineChain(3441006),
    address: import.meta.env.VITE_CONTRACT_ADDRESS_1 as string,
  });

  const contract2 = getContract({
    client,
    chain: defineChain(11155111),
    address: import.meta.env.VITE_CONTRACT_ADDRESS_2 as string,
  });

  const contract3 = getContract({
    client,
    chain: defineChain(11155111),
    address: import.meta.env.VITE_CONTRACT_ADDRESS_3 as string,
  });

  return (
    <SocialTokenContext.Provider
      value={{
        contract1,
        contract2,
        contract3,
        wallets,
        client,
      }}
    >
      {children}
    </SocialTokenContext.Provider>
  );
};

export const useSocialTokenContext = () => {
  const context = useContext(SocialTokenContext);
  if (context === undefined) {
    throw new Error(
      "useVotingContext must be used within a SocialTokenContextProvider",
    );
  }
  return context;
};