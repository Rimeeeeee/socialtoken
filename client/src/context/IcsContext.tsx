import React, { useContext, createContext, ReactNode } from "react";
import {
  createThirdwebClient,
  getContract,
  defineChain,
  ThirdwebClient,
} from "thirdweb";
import { createWallet } from "thirdweb/wallets";
const wallets = [createWallet("io.metamask")];
interface IcsTokenContextProps {
 
  contract: any;
  wallets: any;
  client: any;
}

const IcsTokenContext = createContext<IcsTokenContextProps | undefined>(undefined);

const client: ThirdwebClient = createThirdwebClient({
  clientId:import.meta.env.VITE_CONTRACT_ADDRESS as string,
  
});

interface IcsTokenContextProviderProps {
  children: ReactNode;
}

export const IcsTokenContextProvider = ({
  children,
}: IcsTokenContextProviderProps) => {
  const contract = getContract({
    client,
    chain: defineChain(2442),
    address:import.meta.env.VITE_CONTRACT_ADDRESS as string,
  });

  

  return (
    <IcsTokenContext.Provider
      value={{
      
        contract,
        wallets,
        client,
      }}
    >
      {children}
    </IcsTokenContext.Provider>
  );
};

export const useIcsTokenContext = () => {
  const context = useContext(IcsTokenContext);
  if (context === undefined) {
    throw new Error(
      "useStateContext must be used within a IcsTokenContextProvider",
    );
  }
  return context;
};