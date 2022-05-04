import Badge from 'react-bootstrap/Badge';
import React, { useState, useEffect } from "react";

import { ApiPromise } from '@polkadot/api'

function BlockListener(props){
    let node = props.node;
    const [blockNo,setBlockNo] = useState(0)



    useEffect(() => {
        const getBlock = async () => {
            const api = await ApiPromise.create({ provider:node });
            const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
                setBlockNo(parseInt(header.number.toBigInt()));
              });
            unsubscribe();
        }

        const interval = setInterval(() => {
            getBlock();
        }, 2000);
        return () => clearInterval(interval);
      }, []);

    return (
        <Badge bg="secondary">
                Block # {blockNo}
        </Badge>
    )
}
export default BlockListener;