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
import WalletBalance from "./walletBalance";

function WhispApp (){
    const whisp_cards = [];

    const [node, setNode] = useState(NodeConnect("ws://127.0.0.1:9945"));

    const [firstRender, setFirstRender] = useState(false);

    const [walletNotConnected, setwalletNotConnected] = useState(true);

    const [walletSelected, setWalletSelected] = useState(undefined);

    const [queriedWhisps, setQueriedWhisps] = useState([]);

    const [queriedWhispIds, setQueriedWhispIds] = useState([]);

    const parseWhisp = ({whash,whisper,timestamp,content}) => ({hash:whash.toJSON(),
                                                                whisper:whisper.toJSON(),
                                                                timestamp: parseInt(timestamp.toString().substring(0,timestamp.toString().length - 6)),
                                                                content: content.toHuman()
                                                                })
//timestamp: new Date(parseInt(timestamp.toString().substring(0,timestamp.toString().length - 6))).toString(),

    const handleWhisp = async (e) => {
        await whispOnce(e);
        clearWhispInput(e);
        await new Promise(res => setTimeout(res, 2000));
        getAllWhisps(node);
    }

    const whispOnce = async (e) => {
        let whispValue = e.target.form.elements[0].value;
        const api = await ApiPromise.create({ provider:node });
        const injector = await web3FromAddress(walletSelected.address);
        const result = await api.tx.palletWhisper.whisp(whispValue).signAndSend(walletSelected.address, {signer: injector.signer});
        console.log(result)
    }

    const clearWhispInput = (e) => {
        e.target.form.elements[0].value = "";
    }

    const handleConnected = () => {
        setwalletNotConnected(false);
    }

    const handleDisConnect = () => {
        setwalletNotConnected(true);
    }

    const getAllWhisps = async (node) => {
        const api = await ApiPromise.create({ provider:node });
        const entries = await api.query.palletWhisper.whisp.entries();
        const whisps_entries = entries.map(entry => parseWhisp(entry[1].unwrap()));
        //sort list desc
        whisps_entries.sort((a,b)=> (a.timestamp < b.timestamp)?1:-1); 
        setQueriedWhisps(whisps_entries);
        console.log(whisps_entries);
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

    // if we keep calling the node, the node rejects connection if too many happens in a short interval
    /*useEffect(() => {
        const interval = setInterval(() => {
            getAllWhisps(node);
        }, 120000);
        return () => clearInterval(interval);
      }, []);*/

    return(<>
        <div id="whisp-app">
            <Container fluid className="d-grid gap-5">
                <Container>
                    <Row className="justify-content-md-center">Whisp Frontend Demo</Row>
                    <br/>
                    <Row className="justify-content-md-center">
                        <Col sm="3">
                            <ConnectWalletButton setWallet={setWalletSelected} handleConnected={handleConnected} handleDisConnect={handleDisConnect}/>
                        </Col>
                        <Col sm="3">
                            <WalletBalance walletSelected={walletSelected} disabled={walletNotConnected}/>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Form>

                        <Form.Group className="mb-3" controlId="whispa-here">
                            <Row className="justify-content-md-center">
                                <Col sm="10">
                                    <Form.Control type="text" as="textarea" placeholder="Whispa HERE!" disabled={walletNotConnected}/>
                                </Col>
                            </Row>
                        </Form.Group>

                        <Button variant="secondary" onClick={e => handleWhisp(e)} disabled={walletNotConnected}>
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