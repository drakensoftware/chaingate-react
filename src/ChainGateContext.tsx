import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ChainGate } from 'chaingate';

interface ChainGateContextType {
  chaingate: ChainGate | null;
  setChainGate: (cg: ChainGate | null) => void;
}

const ChainGateContextInternal = createContext<ChainGateContextType | undefined>(undefined);

export const ChainGateProvider = ({ children }: { children: ReactNode }) => {
  const [chaingate, setChainGate] = useState<ChainGate | null>(null);

  return (
    <ChainGateContextInternal.Provider value={{ chaingate, setChainGate }}>
      {children}
    </ChainGateContextInternal.Provider>
  );
};

export function useChainGate() {
  const ctx = useContext(ChainGateContextInternal);
  if (!ctx) {
    throw new Error('useChainGate must be used within <ChainGateProvider>');
  }

  const { chaingate, setChainGate } = ctx;

  const initializeChainGate = useCallback(
    ({ apiKey }: { apiKey: string }): ChainGate => {
      const cg = new ChainGate({ apiKey });
      setChainGate(cg);
      return cg;
    },
    [setChainGate],
  );

  return { chaingate, initializeChainGate };
}
