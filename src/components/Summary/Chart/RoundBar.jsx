import React, { Component } from 'react';

const RoundedBar = (props) => {
    // Render the bar with rounded corners
    const { fill, x, y, width, height } = props;
    return (
        <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fill}
            rx={8} // これがborder-radiusに相当します
            ry={8}
        />
    );
}

export default RoundedBar;
