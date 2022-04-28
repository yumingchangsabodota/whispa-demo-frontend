import {
    web3Accounts,
    web3Enable,
    web3FromAddress,
    web3ListRpcProviders,
    web3UseRpcProvider
  } from '@polkadot/extension-dapp';

async function PolkadotJsExtensionConnector(appName){
    const allInjected = await web3Enable(appName);
    const allAccounts = await web3Accounts();

    return [allInjected, allAccounts];
}

export default PolkadotJsExtensionConnector;