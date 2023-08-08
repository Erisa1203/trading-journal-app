import React, { useState } from 'react';

export const CustomOption = ({ innerProps, label, data }) => {
    const [isHovered, setIsHovered] = useState(false);  // ホバー状態を管理するためのローカルステート
    // console.log(data)
    return (
        <div 
            {...innerProps}
            className="note-select__option" 
            onMouseEnter={() => setIsHovered(true)}   // マウスが要素上に入った時にホバー状態を true に
            onMouseLeave={() => setIsHovered(false)}  // マウスが要素から離れた時にホバー状態を false に
            style={{
              backgroundColor: isHovered ? '#37352f14' : '#ffffff',  // ホバー状態に応じて背景色を変更
              width: '100%',
              padding: '8px',
            }}
        >
          <div
            className="note-select__tag"
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: data.color || '#ffffff',
              display: 'inline-block',
              whiteSpace: 'nowrap',
              fontWeight: '700'
            }}
          >
            {label}
          </div>
        </div>
    );
};
