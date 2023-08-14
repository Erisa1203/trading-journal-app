import React, { useContext } from 'react'
import { Timestamp } from 'firebase/firestore';
import "./_tradeTable.styl"
import { sortByEntryDateAsc, sortByEntryDateDesc } from '../../services/filter';
import { TradesContext } from '../../contexts/TradesContext'

const TradeTable = ({ trades, onTradeRowClick }) => {
    const { filteredTrades } = useContext(TradesContext);
    console.log('filteredTrades', filteredTrades)
    return (
        <table className="tradeTable">
            <thead className="tradeTable__head">
            <tr>
                <th className='tradeTable__status'>STATUS</th>
                <th className='tradeTable__pairs'>PAIRS</th>
                <th className='tradeTable__dir'>DIR</th>
                <th className='tradeTable__entryDate'>ENTRY DATE</th>
                <th className='tradeTable__exitDate'>EXIT DATE</th>
                <th className='tradeTable__entryPrice'>ENTRY PRICE</th>
                <th className='tradeTable__exitPrice'>EXIT PRICE</th>
                <th className='tradeTable__lot'>LOT</th>
                <th className='tradeTable__percent'>%</th>
                <th className='tradeTable__setup'>SETUP</th>
            </tr>
            </thead>
            <tbody>
            {filteredTrades && filteredTrades.length > 0 ?
                sortByEntryDateAsc(filteredTrades).map((trade, index) => (
                    <tr 
                        key={index} 
                        className="tradeTable__row" 
                        onClick={() => onTradeRowClick(trade)} 
                    >

                        <td className='tradeTable__status'>{trade.STATUS}</td>
                        <td className='tradeTable__pairs'>{trade.PAIRS}</td>
                        <td className='tradeTable__dir'>{trade.DIR}</td>

                        <td className='tradeTable__entryDate'>
                            {trade.ENTRY_DATE
                                ? (trade.ENTRY_DATE instanceof Timestamp
                                ? trade.ENTRY_DATE.toDate().toLocaleString()
                                : trade.ENTRY_DATE.toLocaleString())
                                : 'N/A'}
                        </td>
                        <td className='tradeTable__exitDate'>
                            {trade.EXIT_DATE
                                ? (trade.EXIT_DATE instanceof Timestamp
                                ? trade.EXIT_DATE.toDate().toLocaleString()
                                : trade.EXIT_DATE.toLocaleString())
                                : 'N/A'}
                        </td>
                        <td className='tradeTable__entryPrice'>{trade.ENTRY_PRICE}</td>
                        <td className='tradeTable__exitPrice'>{trade.EXIT_PRICE}</td>
                        <td className='tradeTable__lot'>{trade.LOT}</td>
                        <td className='tradeTable__percent'>{trade.RETURN}</td>
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
