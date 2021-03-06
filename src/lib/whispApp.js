import {
    web3Accounts,
    web3Enable,
    web3FromAddress,
    web3ListRpcProviders,
    web3UseRpcProvider
  } from '@polkadot/extension-dapp';

import {React, useState, useEffect } from "react";

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
import BlockListener from "./blockListener";

function WhispApp (){

    const [denomination,setDenomination] = useState(12)

    const [node, setNode] = useState(NodeConnect("ws://127.0.0.1:9946"));

    const [firstRender, setFirstRender] = useState(false);

    const [walletNotConnected, setwalletNotConnected] = useState(true);

    const [walletSelected, setWalletSelected] = useState(undefined);

    const [queriedWhisps, setQueriedWhisps] = useState([]);

    const [queriedWhispIds, setQueriedWhispIds] = useState([]);

    const [freeBalance, setFreeBalance] = useState(0);

    const [lockedBalance, setLockedBalance] = useState(0);

    const [reservedBalance, setReservedBalance] = useState(0);

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
        let api = await ApiPromise.create({ provider:node });
        let whispValue = e.target.form.elements[0].value;
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
        let api = await ApiPromise.create({ provider:node });
        const entries = await api.query.palletWhisper.whisp.entries();
        console.log(entries);
        const whisps_entries = entries.map(entry => parseWhisp(entry[1].unwrap()));
        //sort list desc
        whisps_entries.sort((a,b)=> (a.timestamp < b.timestamp)?1:-1);
        setQueriedWhisps(whisps_entries);
        console.log(whisps_entries);
    }

    const getWalletBalance = async(address) => {
        let api = await ApiPromise.create({ provider:node });
        let account = await api.query.system.account(address);
        setFreeBalance(account.data.free);
        setLockedBalance(account.data.feeFrozen);
        setReservedBalance(account.data.reserved);
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
                    <Row className="justify-content-md-center"> Whisp Frontend Demo</Row>
                    <Row className="justify-content-md-center">
                            <BlockListener node={node}/>
                    </Row>
                    <br/>
                    <Row className="justify-content-md-center">
                        <Col sm="3">
                            <WalletBalance walletSelected={walletSelected} node={node} freeBalance={freeBalance} denomination={denomination} getWalletBalance={getWalletBalance}
                            lockedBalance={lockedBalance} reservedBalance={reservedBalance} disabled={walletNotConnected}/>
                        </Col>
                        <Col sm="3">
                            <ConnectWalletButton setWallet={setWalletSelected} handleConnected={handleConnected} handleDisConnect={handleDisConnect} getWalletBalance={getWalletBalance}/>
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