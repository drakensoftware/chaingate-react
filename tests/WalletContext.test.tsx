import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { WalletProvider, useWallet } from '../src/WalletContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <WalletProvider>{children}</WalletProvider>
);

describe('useWallet', () => {
  it('throws when used outside WalletProvider', () => {
    expect(() => renderHook(() => useWallet())).toThrow(
      'useWallet must be used within <WalletProvider>',
    );
  });

  it('starts with wallet as null', () => {
    const { result } = renderHook(() => useWallet(), { wrapper });
    expect(result.current.wallet).toBeNull();
  });

  it('newWallet creates a wallet and updates context', () => {
    const { result } = renderHook(() => useWallet(), { wrapper });

    act(() => {
      const { phrase, wallet } = result.current.newWallet();
      expect(typeof phrase).toBe('string');
      expect(phrase.split(' ').length).toBe(12);
      expect(wallet).toBeDefined();
    });

    expect(result.current.wallet).not.toBeNull();
  });

  it('importWallet with phrase updates context', () => {
    const { result } = renderHook(() => useWallet(), { wrapper });
    const testPhrase =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

    act(() => {
      result.current.importWallet({ phrase: testPhrase });
    });

    expect(result.current.wallet).not.toBeNull();
  });

  it('closeWallet clears the wallet', () => {
    const { result } = renderHook(() => useWallet(), { wrapper });

    act(() => {
      result.current.newWallet();
    });
    expect(result.current.wallet).not.toBeNull();

    act(() => {
      result.current.closeWallet();
    });
    expect(result.current.wallet).toBeNull();
  });

  it('createWalletFromString auto-detects phrase', () => {
    const { result } = renderHook(() => useWallet(), { wrapper });
    const testPhrase =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

    act(() => {
      result.current.createWalletFromString(testPhrase);
    });

    expect(result.current.wallet).not.toBeNull();
  });
});
