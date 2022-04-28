const { ApiPromise } = require('@polkadot/api');

async function readOwnWhisp(address) {
    const api = await ApiPromise.create();
    const [{ nonce: accountNonce }, now, validators] = await Promise.all([
        api.query.system.account(ALICE),
        api.query.timestamp.now(),
        api.query.session.validators()
      ]);
    
      console.log(`accountNonce(${ALICE}) ${accountNonce}`);
      console.log(`last block timestamp ${now.toNumber()}`);
}