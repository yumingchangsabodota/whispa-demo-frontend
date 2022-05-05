import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { useState } from "react";

import {React, ApiPromise } from '@polkadot/api'

import {
    web3FromAddress,
  } from '@polkadot/extension-dapp';

function WalletBalance(props){

    const walletSelected = props.walletSelected;
    const node = props.node;
    const [valueToSend, setValueToSend] = useState(0);
    const [receiver, setReceiver] = useState("");

    //console.log(walletSelected)

    const handleAmountValue = (e) => {
        let amount = e.target.value;
        if(!isNaN(amount) && !isNaN(parseFloat(amount))){
            console.log(e.target.value);
            setValueToSend(amount);
        }else{
            e.target.value = e.target.value.substring(0,e.target.value.length-1);
            console.log(e.target.value);
            if (amount===""){
                setValueToSend(0);
            }else{
                setValueToSend(amount);
            }
            
        }
    }

    const handleReceiver = (e) => {
        setReceiver(e.target.value);
    }


    const handleSendTx =  async(e) => {
        let api = await ApiPromise.create({ provider:props.node });
        let injector = await web3FromAddress(walletSelected.address);
        let result =  await api.tx.balances.transfer(receiver,parseInt(valueToSend*(10**props.denomination))).signAndSend(props.walletSelected.address, {signer: injector.signer});
        console.log(result);
        console.log(result.toJSON());
        e.target.form.elements[0].value = "";
        e.target.form.elements[1].value = "";
        await new Promise(res => setTimeout(res, 5000));
        props.getWalletBalance(walletSelected.address);
    }
 
    //use effect listen to balance change


    return(

            <DropdownButton id="dropdown-basic-button" title="Wallet Balance" variant="secondary" disabled={props.disabled}>
                    <Dropdown.Header>free: {props.freeBalance*(0.1**props.denomination)} WSC</Dropdown.Header>
                    <Dropdown.Header>locked: {props.lockedBalance*(0.1**props.denomination)} WSC</Dropdown.Header>
                    <Dropdown.Header>reserved: {props.reservedBalance*(0.1**props.denomination)} WSC</Dropdown.Header>
                    <Dropdown.Divider />
                    <Form>
                        <Form.Group className="mb-3 d-grid gap-2" controlId="formBasicEmail">
                                <FormControl placeholder="receiver" onChange={e =>handleReceiver(e)} type="text"/>
                                <FormControl placeholder="amount" onChange={e =>handleAmountValue(e)} type="text"/>
                                <Button variant="secondary" onClick={handleSendTx}>
                                    send!
                                </Button>
                        </Form.Group>
                    </Form>
            </DropdownButton>
        )
}

export default WalletBalance;