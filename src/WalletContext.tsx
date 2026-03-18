import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  Wallet,
  PhraseWallet,
  SeedWallet,
  XprivWallet,
  PrivateKeyWallet,
  XpubWallet,
  PublicKeyWallet,
  AnyWallet,
  WalletParams,
  PhraseLanguage,
  PhraseNumOfWords,
} from 'chaingate';
import {
  newWallet as cgNewWallet,
  importWallet as cgImportWallet,
  deserializeWallet as cgDeserializeWallet,
  createWalletFromString as cgCreateWalletFromString,
} from 'chaingate';

interface WalletContextType {
  wallet: Wallet | null;
  setWallet: (wallet: Wallet | null) => void;
}

const WalletContextInternal = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  return (
    <WalletContextInternal.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContextInternal.Provider>
  );
};

export function useWallet() {
  const ctx = useContext(WalletContextInternal);
  if (!ctx) {
    throw new Error('useWallet must be used within <WalletProvider>');
  }

  const { wallet, setWallet } = ctx;

  const newWallet = useCallback(
    (
      language?: PhraseLanguage,
      numberOfWords?: PhraseNumOfWords,
    ): { phrase: string; wallet: PhraseWallet } => {
      const result = cgNewWallet(language, numberOfWords);
      setWallet(result.wallet);
      return result;
    },
    [setWallet],
  );

  type ImportWalletFn = {
    (params: { phrase: string }): PhraseWallet;
    (params: { seed: string | Uint8Array }): SeedWallet;
    (params: { xpriv: string }): XprivWallet;
    (params: { privateKey: string | Uint8Array }): PrivateKeyWallet;
    (params: { xpub: string }): XpubWallet;
    (params: { publicKey: string | Uint8Array }): PublicKeyWallet;
    (params: WalletParams): AnyWallet;
  };

  const importWallet = useCallback(
    ((params: WalletParams): AnyWallet => {
      const w = cgImportWallet(params);
      setWallet(w);
      return w;
    }) as ImportWalletFn,
    [setWallet],
  );

  const deserializeWallet = useCallback(
    (data: unknown, askForPassword?: () => Promise<string | null>): Wallet => {
      const w = cgDeserializeWallet(data, askForPassword);
      setWallet(w);
      return w;
    },
    [setWallet],
  );

  const createWalletFromString = useCallback(
    (input: string): Wallet => {
      const w = cgCreateWalletFromString(input);
      setWallet(w);
      return w;
    },
    [setWallet],
  );

  const closeWallet = useCallback(() => {
    setWallet(null);
  }, [setWallet]);

  return {
    wallet,
    newWallet,
    importWallet,
    deserializeWallet,
    createWalletFromString,
    closeWallet,
  };
}
