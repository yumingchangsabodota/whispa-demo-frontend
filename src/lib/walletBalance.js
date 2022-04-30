import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import React, { useState } from "react";

function WalletBalance(props){

    const walletSelected = props.walletSelected;

    const [toSend, setToSend] = useState(0);

    const handleAmountValue = (e) => {
        let amount = e.target.value;
        if(!isNaN(amount) && !isNaN(parseFloat(amount))){
            setToSend(parseFloat(amount));
        }else{
            setToSend(0);
            e.target.value = ""
        }
        console.log(toSend);
    }
    
    return(

            <DropdownButton id="dropdown-basic-button" title="Wallet Balance" variant="secondary" disabled={props.disabled}>
                    <Card.Header>Wallet Balance</Card.Header>
                    <Card.Text>free: </Card.Text>
                    <Card.Text>locked: </Card.Text>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <div className="d-grid gap-2" >
                        <FormControl placeholder="receiver"/>
                        <FormControl placeholder="amount" onChange={e =>handleAmountValue(e)}/>
                        <Button variant="secondary">
                            send!
                        </Button>
                        </div>
                    </Form.Group>
                    
            </DropdownButton>
        )
}

export default WalletBalance;