import React from 'react'

const CustomBackground = (props) => {
    const { x, y, width, height, fill } = props;
    const adjustedHeight = y + height < 0 ? 0 : height;

    return (
        <rect
            x={x}
            y={y}
            width={width}
            height={adjustedHeight}
            rx={8}
            ry={8}
            fill={fill}
        />
    );
};


export default CustomBackground
