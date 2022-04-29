import {
    web3Accounts,
    web3Enable,
    web3FromAddress,
    web3ListRpcProviders,
    web3UseRpcProvider
  } from '@polkadot/extension-dapp';

import React, { useState, useEffect } from "react";

import { ApiPromise } from '@polkadot/api'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import ConnectWalletButton from './connectWalletButton';
import WhispCard from './whispCard';
import NodeConnect from "./nodeConnect";

function WhispApp (){
    const whisp_cards = [];

    const node = NodeConnect("ws://127.0.0.1:9945");

    const [firstRender, setFirstRender] = useState(false);

    const [whispTextEnable, setWhispTextEnable] = useState(true);

    const [walletSelected, setWalletSelected] = useState(undefined);

    const [injected, setInjected] = useState(undefined);

    const [whispValue, setwhispValue] = useState("");

    const [queriedWhisps, setQueriedWhisps] = useState([]);

    const [queriedWhispIds, setQueriedWhispIds] = useState([]);

    const parseWhisp = ({whash,whisper,timestamp,content}) => ({hash:whash.toJSON(),
                                                                whisper:whisper.toJSON(),
                                                                timestamp: new Date(parseInt(timestamp.toString().substring(0,timestamp.toString().length - 6))).toString(),
                                                                content: content.toHuman()
                                                                })


    const handleWhisp = async (e) => {
        await whispOnce();
        clearWhispInput(e);
        await getAllWhisps(node);
    }

    const whispOnce = async () => {
        const api = await ApiPromise.create({ provider:node });
        console.log(api);
        console.log(injected);
        const injector = await web3FromAddress(walletSelected.address);
        const result = await api.tx.palletWhisper.whisp(new Uint8Array(whispValue)).signAndSend(walletSelected.address, {signer: injector.signer});
        console.log(result)
    }

    const clearWhispInput = (e) => {
        setwhispValue("");
        e.target.form.elements[0].value = "";
    }

    const handleConnected = () => {
        setWhispTextEnable(false);
    }

    const handleDisConnect = () => {
        setWhispTextEnable(true);
    }

    const handleWhispValue = (e) => {
        if (!e.target) {
            setwhispValue("");
        }else{
            let content = e.target.value;
            setwhispValue(content);
        }
    }

    const getAllWhisps = async (node) => {
        const api = await ApiPromise.create({ provider:node });
        const entries = await api.query.palletWhisper.whisp.entries();
        const whisps_entries = entries.map(entry => parseWhisp(entry[1].unwrap()));
        setQueriedWhisps(whisps_entries);
    }

    const getWalletBalance = async (address, node) => {
        console.log(node)
        const api = await ApiPromise.create({ provider:node });
        let { data: { free: previousFree }, nonce: previousNonce } = await api.query.system.account(address);

        console.log(`${address} has a balance of ${previousFree}, nonce ${previousNonce}`);
        console.log(`You may leave this example running and start example 06 or transfer any value to ${address}`);

        const [{ nonce: accountNonce }, now, entries] = await Promise.all([
            api.query.system.account(address),
            api.query.timestamp.now(),
            await api.query.palletWhisper.whisps.entries()
          ]);
        
        console.log(`accountNonce(${address}) ${accountNonce}`);
        console.log(`last block timestamp ${now.toNumber()}`);
        console.log(entries);
        const ids = entries.map(entry => entry[1].unwrap().toJSON());
        console.log(ids[0]);

        return ids[0]
    }


    useEffect(() => {
        if (!firstRender) {
            getAllWhisps(node);
            setFirstRender(true);
          }
        
    }, [firstRender]);


    return(<>
        <div id="whisp-app">
            <Container fluid className="d-grid gap-5">
                <Container>
                    <Row className="justify-content-md-center">
                        <Col sm="3">
                            <ConnectWalletButton setWallet={setWalletSelected} handleConnected={handleConnected} handleDisConnect={handleDisConnect} setInjected={setInjected}/>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Form>

                        <Form.Group className="mb-3" controlId="whispa-here">
                            <Row className="justify-content-md-center">
                                <Col sm="10">
                                    <Form.Control type="text" as="textarea" placeholder="Whispa HERE!" disabled={whispTextEnable} onChange={e =>handleWhispValue(e)}/>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Button variant="secondary" onClick={e => handleWhisp(e)} disabled={whispTextEnable}>
                            Whisp!
                        </Button>

                    </Form>
                </Container>

                <Container fluid className="d-grid gap-2">
                    {
                        queriedWhisps.map((w, index) => {
                            return(
                                <Row className="justify-content-md-center" key={w.hash}>
                                    <WhispCard whisp={w}/>
                                </Row>
                            )
                        })
                    }
                </Container>
            </Container>
        </div>
    </>)

}

export default WhispApp;