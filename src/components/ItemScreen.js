import React from 'react';

export const ItemScreen = ({ best }) => {

    return (

        <>
            {
                best.map( item => {
                    const [ value, volume ] = item;
                    return <p> Price: { parseFloat(value).toFixed(2) } Volume: { parseFloat(volume).toFixed(5) } </p>;
                })
            }
        </>
    )
}
