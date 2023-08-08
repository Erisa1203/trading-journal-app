import React from 'react';

export const CustomSingleValue = ({ data }) => (
    
    <div style={{
        padding: '8px 16px',
        borderRadius: '4px',
        backgroundColor: data.color,
        display: 'inline-block',
        width: 'auto',
        whiteSpace: 'nowrap',
        fontWeight: '700'
    }}>
        {data.label}
    </div>
);
