import React from 'react';

export const ItemScreen = ({ best }) => {
    return (
        <div>
                {

                    best.map( item => {
                        return (
                            <p key={ item }>
                                {
                                    item.map( (value, index) => {
                                        if ( index === 0) {
                                            return <span key={ value }> Price: { parseFloat(value).toFixed(2) } </span>
                                        } else if ( index === 1 ) {
                                            return <span key={ value }> Volume: { parseFloat(value).toFixed(5) } </span>
                                        }
                                        return null;

                                    })
                                }
                            </p>
                        )
                    })

                }
        </div>
    )
}
