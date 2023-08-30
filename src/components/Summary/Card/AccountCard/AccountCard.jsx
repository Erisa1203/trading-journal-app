import React, { useState } from 'react'
import AccountChart from '../../Chart/AccountChart/AccountChart'

const AccountCard = () => {
    const [currentBalance, setCurrentBalance] = useState(500000); // 初期値

    return (
        <div className='chartCard chartCard--sm'>
            <div className="chartCard__head">ACCOUNT</div>
            <div className="chartCard__desc">
                <div className="chartCard__total">¥{currentBalance}</div>
                <span className='chartCard__sub'>+12%</span>
            </div>
            <div className="chart">
                <AccountChart onBalanceChange={setCurrentBalance} />
            </div>
        </div>
    )
}

export default AccountCard
