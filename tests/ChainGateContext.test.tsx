import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ChainGateProvider, useChainGate } from '../src/ChainGateContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ChainGateProvider>{children}</ChainGateProvider>
);

describe('useChainGate', () => {
  it('throws when used outside ChainGateProvider', () => {
    expect(() => renderHook(() => useChainGate())).toThrow(
      'useChainGate must be used within <ChainGateProvider>',
    );
  });

  it('starts with chaingate as null', () => {
    const { result } = renderHook(() => useChainGate(), { wrapper });
    expect(result.current.chaingate).toBeNull();
  });

  it('initializeChainGate creates a ChainGate instance', () => {
    const { result } = renderHook(() => useChainGate(), { wrapper });

    act(() => {
      const cg = result.current.initializeChainGate({ apiKey: 'test-key' });
      expect(cg).toBeDefined();
      expect(cg.networks).toBeDefined();
    });

    expect(result.current.chaingate).not.toBeNull();
    expect(result.current.chaingate!.networks).toBeDefined();
  });
});
