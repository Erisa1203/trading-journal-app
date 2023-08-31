import React, { Component } from 'react';

const RoundedBar = (props) => {
    // Render the bar with rounded corners
    const { fill, x, y, width, height } = props;
    const adjustedHeight = y + height < 0 ? 0 : height;

    return (
        <rect
            x={x}
            y={y}
            width={width}
            height={adjustedHeight}
            fill={fill}
            rx={8} // これがborder-radiusに相当します
            ry={8}
        />
    );
}

export default RoundedBar;
