import { useRef, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { MetaMaskInpageProvider } from '@metamask/providers';

export enum ConnectionStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface MetaMaskConnectionStatus {
  status: ConnectionStatus;
  message?: string;
  solution?: string;
}

interface AddEthereumChainParameterNativeCurrency {
  name: string;
  symbol: string; // 2-6 characters long
  decimals: number;
}

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: AddEthereumChainParameterNativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

interface UseMetamask {
  connectToMetamask: () => Promise<MetaMaskConnectionStatus>;
  ethereumWalletAddress?: string;
  ethereumWalletAddressShort?: string;
}

const chainId = Web3.utils.toHex(Number(import.meta.env.VITE_CHAIN_ID));
const chainName = import.meta.env.VITE_CHAIN_NAME;
const nativeCurrency: AddEthereumChainParameterNativeCurrency = {
  name: import.meta.env.VITE_CHAIN_NATIVE_CURRENCY_NAME,
  symbol: import.meta.env.VITE_CHAIN_NATIVE_CURRENCY_SYMBOL,
  decimals: Number(import.meta.env.VITE_CHAIN_NATIVE_CURRENCY_DECIMALS) || 18,
};
const rpcUrls = [import.meta.env.VITE_CHAIN_RPC_URL];
const blockExplorerUrls = [import.meta.env.VITE_CHAIN_BLOCK_EXPLORER_URL];
const addEthereumNetworkParams: AddEthereumChainParameter = {
  chainId,
  chainName,
  nativeCurrency,
  rpcUrls,
  blockExplorerUrls
}

export const useMetamask = (): UseMetamask => {
  const ethereum = useRef<MetaMaskInpageProvider>((window.ethereum as MetaMaskInpageProvider) || null);
  const [ethereumWalletAddress, setEthereumWalletAddress] = useState<string>();
  const [ethereumWalletAddressShort, setEthereumWalletAddressShort] = useState<string>();
  
  const switchNetwork = async (): Promise<MetaMaskConnectionStatus | null> => { 
    try {
      await ethereum.current.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });

      return null;
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await ethereum.current.request({
            method: 'wallet_addEthereumChain',
            params: [addEthereumNetworkParams],
          });

          return null;
        } catch (error: any) {
          
          return {
            status: ConnectionStatus.ERROR,
            message: error.message
          };
        }
      }

      return {
        status: ConnectionStatus.ERROR,
        message: error.message
      };
    }
  }

  const connectToMetamask = async (): Promise<MetaMaskConnectionStatus> => {
    const provider = await detectEthereumProvider();

    if (provider) {
      const isValidNetwork = await switchNetwork() === null;
      
      if (isValidNetwork) {
        try {
          const accounts = await ethereum.current.request<string[]>({ method: 'eth_requestAccounts' })
          const currentEthereumWalletAddress = typeof accounts === 'string' ? accounts : ((accounts as string[]).shift())

          if (currentEthereumWalletAddress) {
            const currentEthereumWalletAddressShort = `${currentEthereumWalletAddress.substring(0, 6)}...${currentEthereumWalletAddress.substring(currentEthereumWalletAddress.length - 6)}`;
            setEthereumWalletAddress(currentEthereumWalletAddress);
            setEthereumWalletAddressShort(currentEthereumWalletAddressShort);
          }
        } catch (error: any) {

          return {
            status: ConnectionStatus.ERROR,
            message: error.message,
            solution: 'Please, contact our support team.'
          }
        }

        return {
          status: ConnectionStatus.SUCCESS,
          message: 'Metamask is connected'
        };
      }

      return {
        status: ConnectionStatus.ERROR,
        message: 'Could not connect to a valid network.'
      };

    } else {

      return {
        status: ConnectionStatus.ERROR,
        message: 'Metamask not found',
        solution: 'Please, install the Metamask Chrome extension and try again'
      };
    }
  }

  return { connectToMetamask, ethereumWalletAddress, ethereumWalletAddressShort };
}