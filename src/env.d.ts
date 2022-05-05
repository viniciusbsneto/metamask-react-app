/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHAIN_ID: string;
  readonly VITE_CHAIN_NAME: string;
  readonly VITE_CHAIN_NATIVE_CURRENCY_NAME: string;
  readonly VITE_CHAIN_NATIVE_CURRENCY_SYMBOL: string;
  readonly VITE_CHAIN_NATIVE_CURRENCY_DECIMALS: string;
  readonly VITE_CHAIN_RPC_URL: string;
  readonly VITE_CHAIN_BLOCK_EXPLORER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

VITE_CHAIN_ID=97
VITE_CHAIN_NAME=Smart Chain - Testnet
VITE_CHAIN_NATIVE_CURRENCY_NAME=Binance Coin
VITE_CHAIN_NATIVE_CURRENCY_SYMBOL=BNB
VITE_CHAIN_NATIVE_CURRENCY_DECIMALS=18
VITE_CHAIN_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
VITE_CHAIN_BLOCK_EXPLORER_URL=https://testnet.bscscan.com