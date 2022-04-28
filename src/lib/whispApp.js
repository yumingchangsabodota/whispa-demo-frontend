import React, { useState } from "react";
import { ApiPromise } from '@polkadot/api'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

import ConnectWalletButton from './connectWalletButton'
import NodeConnect from "./nodeConnect";

function WhispApp (){
    const whisp_cards = [];

    const node = NodeConnect("ws://127.0.0.1:9945");
    
    const [whispTextEnable, setWhispTextEnable] = useState(true);

    const [walletSelected, setWalletSelected] = useState(undefined);

    const [whispValue, setwhispValue] = useState("");

    const handleWhisp = (e) => {
        console.log(walletSelected);
        console.log(whispValue);
        clearWhisp(e);
        getWalletBalance(walletSelected.address, node);
    }

    const clearWhisp = (e) => {
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

    const getWalletBalance = async (address, node) => {
        console.log(node)
        const api = await ApiPromise.create({ provider:node });
        let { data: { free: previousFree }, nonce: previousNonce } = await api.query.system.account(address);

        console.log(`${address} has a balance of ${previousFree}, nonce ${previousNonce}`);
        console.log(`You may leave this example running and start example 06 or transfer any value to ${address}`);

    }

    return(<>
        <div id="whisp-app">
        <ConnectWalletButton setWallet={setWalletSelected} handleConnected={handleConnected} handleDisConnect={handleDisConnect} />
            <Form>
                <Form.Group className="mb-3" controlId="whispa-here">
                    <Col sm="10">
                        <Form.Control type="text" as="textarea" placeholder="Whispa HERE!" disabled={whispTextEnable} onChange={e =>handleWhispValue(e)}/>
                    </Col>
                </Form.Group>
                <Button variant="secondary" onClick={e => handleWhisp(e)} disabled={whispTextEnable}>
                    Whisp!
                </Button>
            </Form>
        </div>
    </>)

}

export default WhispApp;