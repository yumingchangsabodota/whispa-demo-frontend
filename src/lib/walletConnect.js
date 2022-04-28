
import IsMobile from './utils/deviceChecker'
import PolkadotJsExtensionConnector from './utils/polkadotExtensionConnctor'


async function WalletConnect(appName) {
    const isMobile = IsMobile();

    if(!isMobile){    
        const [allInjected, allAccounts] = await PolkadotJsExtensionConnector(appName);
        //console.log(allInjected);
        //console.log(allAccounts);
        return [allInjected,allAccounts];
    }
}
export default WalletConnect;