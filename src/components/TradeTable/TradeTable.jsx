import React from 'react'
import "./_tradeTable.styl"

const TradeTable = ({ trades }) => {
    
    return (
        <table className="tradeTable">
            <thead className="tradeTable__head">
            <tr>
                <th className='tradeTable__status'>STATUS</th>
                <th className='tradeTable__pairs'>PAIRS</th>
                <th className='tradeTable__entryDate'>ENTRY DATE</th>
                <th className='tradeTable__exitDate'>EXIT DATE</th>
                <th className='tradeTable__entryPrice'>ENTRY PRICE</th>
                <th className='tradeTable__exitPrice'>EXIT PRICE</th>
                <th className='tradeTable__lot'>LOT</th>
                <th className='tradeTable__dir'>DIR</th>
                <th className='tradeTable__percent'>%</th>
                <th className='tradeTable__setup'>SETUP</th>
            </tr>
            </thead>
            <tbody>
            {trades && trades.length > 0 ?
                trades.map((trade, index) => (
                    <tr key={index} className="tradeTable__row">
                        <td className='tradeTable__status'>{trade.STATUS}</td>
                        <td className='tradeTable__pairs'>{trade.PAIRS}</td>
                        <td className='tradeTable__entryDate'>{trade.ENTRY_DATE ? trade.ENTRY_DATE.toDate().toLocaleString() : 'N/A'}</td>
                        <td className='tradeTable__exitDate'>{trade.ENTRY_DATE ? trade.EXIT_DATE.toDate().toLocaleString() : 'N/A'}</td>
                        <td className='tradeTable__entryPrice'>{trade.ENTRY_PRICE}</td>
                        <td className='tradeTable__exitPrice'>{trade.EXIT_PRICE}</td>
                        <td className='tradeTable__lot'>{trade.LOT}</td>
                        <td className='tradeTable__dir'>{trade.DIR}</td>
                        <td className='tradeTable__percent'>{trade.PERCENT}</td>
                        <td className='tradeTable__setup'>{trade.SETUP}</td>   
                    </tr>
                ))
                :
                <>
                    <tr className="tradeTable__row">
                        <td className='tradeTable__status'>DEMO</td>
                        <td className='tradeTable__pairs'>DEMO</td>
                        <td className='tradeTable__entryDate'>DEMO</td>
                        <td className='tradeTable__exitDate'>DEMO</td>
                        <td className='tradeTable__entryPrice'>DEMO</td>
                        <td className='tradeTable__exitPrice'>DEMO</td>
                        <td className='tradeTable__lot'>DEMO</td>
                        <td className='tradeTable__dir'>DEMO</td>
                        <td className='tradeTable__percent'>DEMO</td>
                        <td className='tradeTable__setup'>DEMO</td>   
                    </tr>
                    <tr className="tradeTable__row">
                        <td className='tradeTable__status'>DEMO</td>
                        <td className='tradeTable__pairs'>DEMO</td>
                        <td className='tradeTable__entryDate'>DEMO</td>
                        <td className='tradeTable__exitDate'>DEMO</td>
                        <td className='tradeTable__entryPrice'>DEMO</td>
                        <td className='tradeTable__exitPrice'>DEMO</td>
                        <td className='tradeTable__lot'>DEMO</td>
                        <td className='tradeTable__dir'>DEMO</td>
                        <td className='tradeTable__percent'>DEMO</td>
                        <td className='tradeTable__setup'>DEMO</td>   
                    </tr>
                    <tr className="tradeTable__row">
                        <td className='tradeTable__status'>DEMO</td>
                        <td className='tradeTable__pairs'>DEMO</td>
                        <td className='tradeTable__entryDate'>DEMO</td>
                        <td className='tradeTable__exitDate'>DEMO</td>
                        <td className='tradeTable__entryPrice'>DEMO</td>
                        <td className='tradeTable__exitPrice'>DEMO</td>
                        <td className='tradeTable__lot'>DEMO</td>
                        <td className='tradeTable__dir'>DEMO</td>
                        <td className='tradeTable__percent'>DEMO</td>
                        <td className='tradeTable__setup'>DEMO</td>   
                    </tr>
                </>
        }
            </tbody>
        </table>
    )
}

export default TradeTable
