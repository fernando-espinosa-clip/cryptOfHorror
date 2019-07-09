import React from 'react';

const Viewport = (props) => {
    const { width, height, map, /* player,*/ viewPortCords: [xcor, ycor] } = props;
    // const mapHeight = map.length;
    // const mapWidth = map[0].length;
    const displayTypes = false;
    return (
        map.filter((v, y) => (y >= ycor && y < ycor + height)).map((element, index) => {
            return (
                <div className='row' key={index}>
                    {
                        element.filter((v, x) => (x >= xcor && x < xcor + width)).map((cell, i) => {
                            const subType = cell.entity && cell.entity.subType ? cell.entity.subType : '';
                            return (
                                <div className={`cell ${cell.type}`} key={i}>
                                    {cell.type !== 'nothing' &&
                                    <div className={`${cell.type} ${cell.variant ? cell.variant : ''}`}>
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