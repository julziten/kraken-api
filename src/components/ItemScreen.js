import React, { useEffect, useState } from 'react';

export const ItemScreen = ({ best, upt }) => {

    const [state, setState] = useState(best);

    const replaceValues = (arr1, arr2) => {

        for (let i = 0; i < arr2.length; i++) {
          let numToCheck = arr2[i][0];
          let arrToReturn = arr2[i];
          let volumeToCheck = arr2[i][1];
      
          // si el volumen no es 0
          if (volumeToCheck !== '0.00000000') {
            // mapea el array
            arr1.map((innerArr, index) => {
              if (numToCheck === innerArr[0]) {
                //update the volume of a price item, if price is same
                arr1.splice(index, 1, arrToReturn);
              } else if (numToCheck !== innerArr[0]) {
                arr1.push(arr2[i]);
              }
              return null;
            });
          }
        }
        // removing duplicates
        let resp = [...new Set(arr1)];
        return resp;
    };

    useEffect(() => {
        setState( replaceValues(best, upt) );
    }, [upt])

    // const test = replaceValues(best, upt);

    return (

        <>
            {
                state.map( item => {
                    const [ value, volume ] = item;
                    return <p> Price: { parseFloat(value).toFixed(2) } Volume: { parseFloat(volume).toFixed(5) } </p>;
                })
            }
        </>
    )
}
