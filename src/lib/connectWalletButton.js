import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import WalletConnect from './walletConnect';

const ConnectWalletButton = (props) => {
    const appName = "Whispa";

    const [buttonText, setbuttonText] = useState("Connect Wallet");
    const [showSelectWallet, setShowSelectWallet] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [walletConnected, setConnectedWallets] = useState([]);

    const [walletSelected, setWalletSelected] = useState(undefined);

    const [injected, setInjected] = useState(undefined);

    //const node = NodeConnect('ws://127.0.0.1:9945');

    const handleConnectWallet = async () => {
        let allconnected = await WalletConnect(appName);
        let wallets = allconnected[1];
        let injected = allconnected[0];
        setInjected(injected);
        setConnectedWallets(wallets);
        setShowModal(true);
        setShowSelectWallet(true);
    }

    const handleChooseWallet = wallet => () => {
        let button_text = wallet.address.substring(0, 10) +"...\n   "+wallet.meta.name;
        setWalletSelected(wallet);
        props.setWallet(wallet);
        props.handleConnected();
        setbuttonText(button_text);
        setShowModal(false);
        setShowSelectWallet(false);
        let addr = wallet.address;
        props.getWalletBalance(addr);
    }

    const handleCloseModal = () => setShowModal(false);

    const handleDisconnectWallet = () => {
        setbuttonText("Connect Wallet");
        props.handleDisConnect();
        props.setWallet(undefined);
        setWalletSelected(undefined);
        setShowModal(false);
        setShowSelectWallet(false);
    }

    return(
        <>
            <Button variant="outline-primary" onClick={handleConnectWallet} id="connect-wallet-button" wallet={walletSelected}>
                {buttonText}
            </Button>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose Wallet</Modal.Title>
                </Modal.Header>
                {
                showSelectWallet && (
                    <Modal.Body>
                        <Container>
                            <div className="d-grid gap-2" id="selectCWallet">
                                {
                                walletConnected.map((wallet, index) => {
                                    return(
                                    <Button key={wallet.address} variant="outline-info" size="sm" onClick={handleChooseWallet(wallet)}>
                                        <p>{wallet.meta.name}<br/></p>
                                        <p>{wallet.address}</p>
                                    </Button>
                                    )
                                })
                                }
                                {
                                walletConnected.length>0 &&(
                                <Button variant="outline-info" size="sm" onClick={handleDisconnectWallet}>
                                        <p>
                                        Disconnect
                                        </p>
                                </Button>
                                )
                                }
                            </div>
                        </Container>
                    </Modal.Body> 
                )
                }

            </Modal>

        </>
    );
}
export default ConnectWalletButton;