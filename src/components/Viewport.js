import React from 'react';
import { VISITED_PLACES_OPACITY } from '../helpers/dungeon'

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
                            if (distance > 3) {
                                if (distance === 4)  opacityValue = 0.7;
                                if (distance === 5)  opacityValue = 0.5;
                                if (distance > 5) {
                                    opacityValue = 0;
                                    if (cell.visited) opacityValue = VISITED_PLACES_OPACITY;
                                }

                            }
                            return (
                                <div style={cell.type === 'door' ? {opacity: opacityValue, zIndex: index} : {}}
                                     className={`cell ${cell.type}`} key={i}>
                                    {cell.type !== 'nothing' &&
                                    <div
                                        style={{opacity: opacityValue, zIndex: index}}
                                         className={`${cell.type} ${cell.variant ? cell.variant : ''}`}>
                                        {displayTypes && cell.type}
                                    </div>}
                                    {cell.entity &&
                                    <div
                                        style={{opacity: opacityValue === VISITED_PLACES_OPACITY ? 0 : opacityValue}}
                                        className={`entity ${cell.entity.type} ${cell.entity.direction} ${subType}`}/>}

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