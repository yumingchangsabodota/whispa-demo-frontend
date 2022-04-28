import { ApiPromise, WsProvider } from '@polkadot/api'

async function NodeConnect(ws_node) {
    const provider = new WsProvider(ws_node);
    const api = await ApiPromise.create({ provider });
    const [chain, nodeName, nodeVersion] = await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version()
      ]);
    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

    let count = 0;

    const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
        console.log(`Chain is at block: #${header.number}`);

        if (++count === 256) {
            unsubscribe();
          }
    });

}

export default NodeConnect;