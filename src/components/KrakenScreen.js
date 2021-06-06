import React, { useEffect, useRef, useState } from 'react';
import { ItemScreen } from './ItemScreen';

const WebSocket = require('isomorphic-ws');


export const KrakenScreen = () => {

    const wsRef = useRef();

    if ( !wsRef.current ) {
      wsRef.current = new WebSocket('wss://ws.kraken.com');
    }

    const [data, setData] = useState([]);

    const [bids, setBids] = useState([]);

    const [asks, setAsks] = useState([]);


    useEffect(() => {
        const incomingInfo = data[1];
        // if we have data
        if ( incomingInfo ) {
            // store first 10 asks and bids values
            if (Object.keys(incomingInfo).includes('as')) {
                const { as, bs } = incomingInfo;
                setAsks(as);
                setBids(bs);
            }

            // create a copy for the received values
            const copyAsks = [...asks];
            const copyBids = [...bids];

            // map the updates
            const addUpdates = (name, type) => {

                name.map( item => {
                    const [price, volume] = item;

                    // check if volume is not 0
                    if (volume !== '0.00000000') {
                        const arr = (type === asks) ? copyAsks : copyBids;

                        // map through array
                        arr.map((innerArray, index) => {
                            const innerPrice = innerArray[0];
                            if (price === innerPrice) {
                                // if price is the same, update value
                                arr.splice(index, 1, item);
                            } else if (price !== innerPrice) {
                                // if price is different, add it to array
                                arr.push(item);
                            }
                            return null;
                        })

                        // removing duplicated
                        const remDup = [...new Set(arr)];

                        // set final results
                        (type === asks) ? setAsks(remDup) : setBids(remDup);
                    }
                    return null;
                })
            }

            if ( Object.keys(incomingInfo).includes('a') ) {
                const { a } = incomingInfo;
                addUpdates(a, asks);
            }
            if (Object.keys(incomingInfo).includes('b') ) {
                const { b } = incomingInfo;
                addUpdates(b, bids);
            }
        }
    }, [data, asks, bids]);

    useEffect(() => {
        wsRef.current.onopen = () => {
            console.log('Connected');
          }

          wsRef.current.onmessage = (msg) => {
            const message = JSON.parse(msg.data);

            // store data received
            setData(message);

          }

          wsRef.current.onclose = () => {
            console.log('closing connection');
          }

          return () => {
            wsRef.current.close()
          }
    }, [])

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
              "name": "book",
              "depth": 10,
              "ratecounter": true
            }
          }
        ))
        console.log('Send subscribe');
      }

    // inside component that returns the result of the spread
    const GetSpread = () => {

        const priceAsk = asks.map(item => item[0]);

        const priceBid = bids.map(item => item[0]);

        const relDiff = (a, b) => 100 * Math.abs( ( a - b ) / ( ( a + b ) / 2 ) );

        const result = relDiff(Math.min(...priceAsk),Math.max(...priceBid)).toFixed(5);

        return (
            <div>
                Spread: { result } %
            </div>
        )

    }

    return (
        <>
            <h1>Kraken Screen</h1>
            <button onClick={ wsSubscription }>Subscribe</button>
            <button onClick={ wsClose }>Close WebSockets</button>

            <div style={ { display: 'flex', justifyContent: 'space-around' } }>
                <div>
                    Best Asks:
                    <ItemScreen best={asks} key="as"/>
                </div>

                {

                    asks.length > 0 && <GetSpread />
                    
                }

                <div>
                    Best Bids:
                    <ItemScreen best={bids} key="bs"/>
                </div>
            </div>

        </>
    )
}
