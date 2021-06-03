import React, { useEffect, useReducer, useRef } from 'react';
import { updateReducer } from '../reducers/updateReducer';
import { ItemScreen } from './ItemScreen';

const WebSocket = require('isomorphic-ws');


export const KrakenScreen = () => {

    const wsRef = useRef();

    if ( !wsRef.current ) {
      wsRef.current = new WebSocket('wss://ws.kraken.com');
    }    
    
    const [ updates, dispatch ] = useReducer(updateReducer, {});

    const { snapshot = {}, update = {} } = updates;

    const { as = [], bs = [] } = snapshot;

    const { a = [], b = [] } = update;


    useEffect(() => {
        wsRef.current.onopen = () => {
            console.log('Connected');
          }

          wsRef.current.onmessage = (msg) => {
            const message = JSON.parse(msg.data);

            const [ , only = {} ] = Array.from(message);

            if ( Object.keys(only).includes('as') ) {
                dispatch({
                    type: 'add',
                    payload: only
                });
            } else if ( 
                Object.keys(only).includes('a') ||  
                Object.keys(only).includes('b') ) {
                dispatch({
                    type: 'update',
                    payload: only
                })
            }

          }

          wsRef.current.onclose = () => {
            console.log('closing connection');
          }

          return () => {
            wsRef.current.close()
          }
    }, [])

    // close websocker
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
              "depth": 10
            }
          }
        ))
        console.log('Send subscribe');
      }

    // inside component that returns the result of the spread
    // const GetSpread = () => {

    //     const arrAs = as.map(item => {
    //         return item[0];
    //     })

    //     const arrBs = bs.map(item => {
    //         return item[0];
    //     })

    //     const relDiff = (a, b) => {
    //         return 100 * Math.abs( ( a - b ) / ( ( a + b ) / 2 ) );
    //     }

    //     const result = relDiff(Math.min(...arrAs),Math.max(...arrBs)).toFixed(5);

    //     return (
    //         <div>
    //             Spread: { result } %
    //         </div>
    //     )

    // }

    return (
        <div>
            <h1>Kraken Screen</h1>
            <button onClick={ wsSubscription }>Subscribe</button>
            <button onClick={ wsClose }>Close WebSockets</button>

            <div style={ { display: 'flex', justifyContent: 'space-around' } }>
                <div>
                    Best Asks:
                    <ItemScreen best={as} upt={a} key="as"/>
                </div>
{/* 
                {

                    as.length !== 0 && <GetSpread />
                    
                } */}

                <div>
                    Best Bids:
                    <ItemScreen best={bs} upt={b} key="bs"/>
                </div>
            </div>

        </div>
    )
}
