import React, { useState } from "react";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

import ConnectWalletButton from './connectWalletButton'

function WhispApp(){
    const whisp_cards = [];

    const [whispTextEnable, setWhispTextEnable] = useState(true);

    const [walletSelected, setWalletSelected] = useState(undefined);

    const [whispValue, setwhispValue] = useState("");

    const handleWhisp = () => {
        console.log(walletSelected)
        console.log(whispValue)

    }

    const handleConnected = () => {
        setWhispTextEnable(false);
    }

    const handleWhispValue = (e) => {
        if (!e.target) {
            setwhispValue("");
        }else{
            let content = e.target.value;
            setwhispValue(content);
        }
    }

    return(<>
        <div id="whisp-app">
        <ConnectWalletButton setWallet={setWalletSelected} handleConnected={handleConnected}/>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Col sm="10">
                        <Form.Control type="text" placeholder="Whispa HERE!" disabled={whispTextEnable} onChange={e =>handleWhispValue(e)}/>
                    </Col>
                </Form.Group>
                <Button variant="secondary" onClick={handleWhisp}>
                    Whisp!
                </Button>
            </Form>
        </div>
    </>)

}

export default WhispApp;