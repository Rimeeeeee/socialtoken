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
  clientId:"89a5e5b847b9dbdf1aa28f3b1363cc9e",
  //import.meta.env.VITE_CONTRACT_ADDRESS
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
    address:"0xbA9489Fb374fC8E241b376fb04c287c29Fa7100d",
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