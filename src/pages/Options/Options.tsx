import React, { useEffect } from 'react';
import './Options.css';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3Auth } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
const clientId =
  'BMOrKGsNSuifb5MOhmMmJOrkptD_vHNpAJ54OIV684-T1BQ5ccoz4JMF6W8bkIlnw5_qaFOEDwNBVhpAwUGClQ4';

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0xaa36a7',
  rpcTarget: 'https://eth-sepolia.public.blastapi.io',
  displayName: 'Ethereum Sepolia',
  blockExplorerUrl: 'https://sepolia.etherscan.io/',
  ticker: 'ETH',
  tickerName: 'Ethereum',
};
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

const openloginAdapter: any = new OpenloginAdapter({
  privateKeyProvider,
});
web3auth.configureAdapter(openloginAdapter);
const Options = () => {
  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);
  const login = async () => {
    await web3auth.connect();
  };
  const getSignerValue = async () => {
    const signer = (await web3auth.provider?.request({
      method: 'eth_private_key',
    })) as string;
    const res = await signer;
    chrome.storage.sync.set({ signer: res }, () => {
      console.log('stored in chrome storage');
    });
  };
  const getCheck = async () => {
    chrome.storage.sync.get(['signer'], (result) => {
      console.log('Value currently is ' + result.signer);
    });
  };
  return (
    <div className="OptionsContainer">
      <div onClick={login}>Connect</div>
      <div onClick={getSignerValue}>Submit</div>
      <div onClick={getCheck}>get check</div>
    </div>
  );
};

export default Options;
