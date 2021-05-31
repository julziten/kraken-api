import React, { useEffect, useRef, useState } from 'react';
import { ItemScreen } from './ItemScreen';

const WebSocket = require('isomorphic-ws');

export const KrakenScreen = () => {

    const wsRef = useRef();

    if ( !wsRef.current ) {
      wsRef.current = new WebSocket('wss://ws.kraken.com');
    }

    const [ state, setState ] = useState([]);

    const { as = [], bs = []} = state;


    useEffect(() => {
        wsRef.current.onopen = () => {
            console.log('Connected');
          }

          wsRef.current.onmessage = (msg) => {
            const message = JSON.parse(msg.data);

            const [ , only = {} ] = Array.from(message);

            if ( Object.keys(only).includes('as')) {
                setState(only);
            }

          }

          wsRef.current.onclose = () => {
            console.log('closing connection');
          }

          return () => {
            wsRef.current.close()
          }
    }, [])

    const wsClose = () => {
        wsRef.current.close()
    }

    const wsSubscription = () => {
        wsRef.current.send(JSON.stringify(
          {
            "event": "subscribe",
            "pair": [
              "XBT/EUR"
            ],
            "subscription": {
              "name": "book",
              "depth": 10
            }
          }
        ))
        console.log('Send subscribe')
      }


    return (
        <div>
            <h1>Kraken Screen</h1>
            <button onClick={ wsSubscription }>Subscribe</button>
            <button onClick={ wsClose }>Close WebSockets</button>

            <div style={ { display: 'flex', justifyContent: 'space-around' } }>
                <div>
                    Best Asks:
                    <ItemScreen best={as} key="as"/>
                </div>

                <div>
                    Best Bids:
                    <ItemScreen best={bs} key="bs"/>
                </div>
            </div>

        </div>
    )
}
