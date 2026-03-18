<p align="center">
  <img src="./logo.png" alt="ChainGate" height="80" />
</p>

<h1 align="center">chaingate-react</h1>

<p align="center">
  React hooks and providers for the <a href="https://www.npmjs.com/package/chaingate">ChainGate</a> cryptocurrency SDK.
</p>

<p align="center">
  <a href="https://github.com/drakensoftware/chaingate-react/actions/workflows/build.yml"><img src="https://github.com/drakensoftware/chaingate-react/actions/workflows/build.yml/badge.svg" alt="Build" /></a>
  <a href="https://github.com/drakensoftware/chaingate-react/actions/workflows/test.yml"><img src="https://github.com/drakensoftware/chaingate-react/actions/workflows/test.yml/badge.svg" alt="Test" /></a>
  <a href="https://github.com/drakensoftware/chaingate-react/actions/workflows/publish.yml"><img src="https://github.com/drakensoftware/chaingate-react/actions/workflows/publish.yml/badge.svg" alt="Publish" /></a>
  <a href="https://www.npmjs.com/package/chaingate-react"><img src="https://img.shields.io/npm/v/chaingate-react?color=blue&label=npm" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/chaingate-react"><img src="https://img.shields.io/npm/dm/chaingate-react?color=green" alt="npm downloads" /></a>
  <a href="https://docs.chaingate.dev"><img src="https://img.shields.io/badge/docs-chaingate.dev-blueviolet?logo=readthedocs&logoColor=white" alt="Documentation" /></a>
  <a href="https://api.chaingate.dev/dashboard"><img src="https://img.shields.io/badge/API%20Key-dashboard-orange" alt="Get API Key" /></a>
  <img src="https://img.shields.io/badge/react-%3E%3D18-61DAFB?logo=react&logoColor=white" alt="React >= 18" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

<h3 align="center">
  📦 <a href="https://www.npmjs.com/package/chaingate">ChainGate SDK</a> &nbsp;&nbsp;|&nbsp;&nbsp; 📖 <a href="https://docs.chaingate.dev">Documentation</a> &nbsp;&nbsp;|&nbsp;&nbsp; 🔑 <a href="https://api.chaingate.dev/dashboard">Get your free API key</a>
</h3>

---

## Features

- 👛 **Wallet state management** -- Create, import, restore, and close wallets via React context
- ⚡ **ChainGate provider** -- Initialize and share the API client across your component tree
- 🪝 **Two hooks, zero boilerplate** -- `useWallet()` and `useChainGate()` for everything
- 🔄 **Auto-sync** -- Wallet state updates are immediately available in all components

## Install

```bash
npm install chaingate-react chaingate react
```

## Examples

### Setup Providers

```tsx
import { ChainGateProvider, WalletProvider } from 'chaingate-react';

function App() {
  return (
    <ChainGateProvider>
      <WalletProvider>
        <YourApp />
      </WalletProvider>
    </ChainGateProvider>
  );
}
```

### Initialize the API Client

```tsx
import { useChainGate } from 'chaingate-react';
import { useEffect } from 'react';

function Init() {
  const { initializeChainGate } = useChainGate();

  useEffect(() => {
    initializeChainGate({ apiKey: 'your-api-key' });
  }, []);

  return null;
}
```

### Create a Wallet

```tsx
import { useWallet } from 'chaingate-react';

function CreateWallet() {
  const { newWallet } = useWallet();

  const handleCreate = () => {
    const { phrase, wallet } = newWallet();
    console.log('Mnemonic:', phrase);
    // wallet is now available across the app via useWallet().wallet
  };

  return <button onClick={handleCreate}>Create Wallet</button>;
}
```

### Import a Wallet

```tsx
import { useWallet } from 'chaingate-react';

function ImportWallet() {
  const { importWallet, createWalletFromString } = useWallet();

  // From mnemonic
  importWallet({ phrase: 'abandon abandon abandon ...' });

  // From private key
  importWallet({ privateKey: '0x...' });

  // From xpub (view-only)
  importWallet({ xpub: 'xpub...' });

  // Auto-detect any format
  createWalletFromString('xprv9s21ZrQH143K...');
}
```

### Check Balance

```tsx
import { useChainGate, useWallet } from 'chaingate-react';

function Balance() {
  const { chaingate } = useChainGate();
  const { wallet } = useWallet();

  const getBalance = async () => {
    if (!chaingate || !wallet) return;
    const eth = chaingate.connect(chaingate.networks.ethereum, wallet);
    const { confirmed } = await eth.addressBalance();
    console.log(confirmed.base(), confirmed.symbol);
  };

  return <button onClick={getBalance}>Get ETH Balance</button>;
}
```

### Send a Transaction

```tsx
const { chaingate } = useChainGate();
const { wallet } = useWallet();

const send = async () => {
  if (!chaingate || !wallet) return;
  const eth = chaingate.connect(chaingate.networks.ethereum, wallet);
  const amount = chaingate.networks.ethereum.amount('0.1');
  const tx = await eth.transfer(amount, '0xRecipient...');
  tx.setFee('high');
  const broadcasted = await tx.signAndBroadcast();
  broadcasted.onConfirmed((details) => {
    console.log('Confirmed in block', details.blockHeight);
  });
};
```

### Connect to Any EVM Chain

```tsx
const bsc = chaingate.networks.evmRpc({
  rpcUrl: 'https://bsc-dataseed.binance.org',
  chainId: 56,
  name: 'BNB Smart Chain',
  symbol: 'BNB',
});

const conn = chaingate.connect(bsc, wallet);
```

### Restore an Encrypted Wallet

```tsx
import { useWallet } from 'chaingate-react';

function RestoreWallet() {
  const { deserializeWallet } = useWallet();

  const restore = () => {
    const saved = JSON.parse(localStorage.getItem('wallet')!);
    deserializeWallet(saved, async () => {
      return window.prompt('Enter your wallet password:');
    });
  };

  return <button onClick={restore}>Restore Wallet</button>;
}
```

### Close Wallet

```tsx
const { closeWallet } = useWallet();

<button onClick={closeWallet}>Log Out</button>
```

---

<p align="center">
  <a href="https://docs.chaingate.dev"><strong>📖 Read the full docs</strong></a>
</p>
