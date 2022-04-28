import { WsProvider } from '@polkadot/api'

function NodeConnect(ws_node) {
    const provider = new WsProvider(ws_node);
    return provider
}

export default NodeConnect;