import React, { useState } from "react";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import WalletConnect from './walletConnect';

function ConnectWalletButton(){
    const appName = "Whispa";

    const [showSelectWallet, setShowSelectWallet] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [walletConnected, setConnectedWallets] = useState([]);

    const handleConnectWallet = async () => {
        let allconnected = await WalletConnect(appName);
        let wallets = allconnected[1];
        let injecteds = allconnected[0];
        setConnectedWallets(wallets);
        setShowModal(true);
        setShowSelectWallet(true);
    }

    const handleChooseWallet = wallet => () => {
        console.log(wallet);
        setShowModal(false);
        setShowSelectWallet(false);
    }

    const handleCloseModal = () => setShowModal(false);


    return(
        <>
            <Button variant="outline-primary" onClick={handleConnectWallet}>
                Connect Wallet
            </Button>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose Wallet</Modal.Title>
                </Modal.Header>
                {
                showSelectWallet && (
                    <Modal.Body>
                    <div className="d-grid gap-2" id="selectCWallet">
                        {
                        walletConnected.map((wallet, index) => {
                            return(
                            <Button key={wallet.address} variant="outline-info" size="lg" onClick={handleChooseWallet(wallet)}>
                                <p>
                                {wallet.meta.name}<br/>
                                {wallet.address}
                                </p>
                            </Button>
                            )
                        })
                        }
                    </div>
                    </Modal.Body> 
                )
                }

            </Modal>

        </>
    );
}
export default ConnectWalletButton;