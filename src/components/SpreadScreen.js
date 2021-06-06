import React, { useEffect, useRef, useState } from 'react';

const WebSocket = require('isomorphic-ws');

export const SpreadScreen = () => {

    const wsRef = useRef();

    if ( !wsRef.current ) {
      wsRef.current = new WebSocket('wss://ws.kraken.com');
    }

    const [data, setData] = useState([]);

    const [bidPrice, askPrice, , bidVolume, askVolume] = data;

    const [bids, setBids] = useState([]);

    const [asks, setAsks] = useState([]);

    useEffect(() => {
        wsRef.current.onopen = () => {
            console.log('Connected');
          }
          wsRef.current.onmessage = (msg) => {
            const message = JSON.parse(msg.data);

            if (message[1]) {
                setData(message[1]);
            }
          }
          

          wsRef.current.onclose = () => {
            console.log('closing connection');
          }

          return () => {
            wsRef.current.close()
          }
    }, [])

    useEffect(() => {
    
        if (data.length > 0) {

            const priceNotRepeated = (value) => value.price !== bidPrice;

            const askPriceNotRepeated = (value) => value.price !== askPrice;

            if ( bids.every(priceNotRepeated) ) {
                setBids((prev) => [
                    ...prev,
                    {
                        price: bidPrice,
                        volume: bidVolume
                    }
                ])
            }

            if ( asks.every(askPriceNotRepeated) ) {
                setAsks((prev) => [
                    ...prev,
                    {
                        price: askPrice,
                        volume: askVolume
                    }
                ])
            }

        }



    }, [data, askPrice, askVolume, asks, bidPrice, bidVolume, bids])

    // close websocket
    const wsClose = () => {
        wsRef.current.close()
    }

    // handle subscription
    const wsSubscription = () => {
        wsRef.current.send(JSON.stringify(
          {
            "event": "subscribe",
            "pair": [
              "XBT/EUR"
            ],
            "subscription": {
              "name": "spread"
            }
          }
        ))
        console.log('Send subscribe');
      }

    return (
        <>
            <h1>Kraken API - WS</h1>

            <button onClick={ wsSubscription }>Subscribe</button>
            <button onClick={ wsClose }>Close WebSockets</button>


             <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>

                 <div>

                     <h2>Best Bids</h2>

                    {
                        bids.map( bid => (
                            <p> {bid.price} {bid.volume} </p>
                        ))
                    }

                 </div>

                 <div>

                     <h2>Best Asks</h2>

                    {
                        asks.map( ask => (
                            <p> {ask.price} {ask.volume} </p>
                        ))
                    }

                 </div>
                

             </div>
             

             
            
        </>
    )
}
