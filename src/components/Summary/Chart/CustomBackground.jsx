import React from 'react'

const CustomBackground = (props) => {
    const { x, y, width, height, fill } = props;

    return (
        <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={8}
            ry={8}
            fill={fill}
        />
    );
};


export default CustomBackground
