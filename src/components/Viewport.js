import React from 'react';

const Viewport = (props) => {
    const { width, height, map, viewPortCords: [xcor, ycor] } = props;
    const displayTypes = false;
    return (
        map.filter((v, y) => (y >= ycor && y < ycor + height)).map((element, index) => {
            return (
                <div className='row' key={index}>
                    {
                        element.filter((v, x) => (x >= xcor && x < xcor + width)).map((cell, i) => {
                            const subType = cell.entity && cell.entity.subType ? cell.entity.subType : '';
                            const distance = cell.distanceFromPlayer;
                            let opacityValue = 1;
                            if (distance > 8) {
                                opacityValue = 0.8;
                                if (distance > 9)  opacityValue = 0.6;
                                if (distance > 10)  opacityValue = 0;

                            }
                            return (
                                <div className={`cell ${cell.type}`} key={i}>
                                    {cell.type !== 'nothing' &&
                                    <div style={{opacity: opacityValue}}
                                         className={`${cell.type} ${cell.variant ? cell.variant : ''}`}>
                                        {displayTypes && cell.type}
                                    </div>}
                                    {cell.entity && <div className={`entity ${cell.entity.type} ${cell.entity.direction} ${subType}`}/>}

                                </div>
                            )
                        })
                    }
                </div>
            )
        })
    )
};

export default  Viewport;