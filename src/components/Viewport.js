import React from 'react';
import { VISITED_PLACES_OPACITY } from '../helpers/dungeon'
import DungeonEntity from './DungeonEntity'

const Viewport = (props) => {
    const { width, height, map, viewPortCords: [xcor, ycor], showShadows, displayDevInfo } = props;
    const scale = 40.8;
    let player = {};
    let playerStyle = {};
    const entities = []
    return (
        <div>
            {map.filter((v, y) => (y >= ycor && y < ycor + height)).map((element, index) => {
                return (
                    <div className='row' key={index}>
                        {
                            element.filter((v, x) => (x >= xcor && x < xcor + width)).map((cell, i) => {
                                const subType = cell.entity && cell.entity.subType ? cell.entity.subType : '';
                                const distance = cell.distanceFromPlayer;
                                let opacityValue = 1;
                                if (distance > 3 && showShadows) {
                                    if (distance === 4) opacityValue = 0.7;
                                    if (distance === 5) opacityValue = 0.6;
                                    if (distance > 5) {
                                        opacityValue = 0;
                                        if (cell.visited) opacityValue = VISITED_PLACES_OPACITY;
                                    }

                                }
                                if (cell.entity && (cell.entity.type === 'player' || cell.entity.type === 'enemy')) {
                                    cell.moveStyle = {
                                        top: `${index * scale}px`,
                                        left: `${i * scale}px`,
                                        position: 'absolute',
                                        background: 'none',
                                        opacity: opacityValue };
                                    entities.push(cell)
                                    // entities.push({ ...cell, ...{ moveStyle: {top: `${index * scale}px`, left: `${i * scale}px`, position: 'absolute', background: 'none'}}})
                                }
                                return (
                                    <div style={cell.type === 'door' ? {opacity: opacityValue, zIndex: index} : {}}
                                         className={`cell ${cell.type}`} key={cell.id}>
                                        {cell.type !== 'nothing' &&
                                        <div
                                            style={{opacity: opacityValue, zIndex: index}}
                                            className={`${cell.type} ${cell.variant ? cell.variant : ''}`}/>}
                                        {(cell.entity && cell.entity.type === 'jaja') &&
                                        <div
                                            style={{opacity: opacityValue === VISITED_PLACES_OPACITY ? 0 : opacityValue}}
                                            className={`entity ${cell.entity.type} ${cell.entity.direction} ${subType}`}
                                        />}
                                        {(displayDevInfo) &&
                                        (<div style={{zIndex: index}} className='extra-info'>
                                            {cell.type}<br/>
                                            {`[${cell.position[0]},${cell.position[1]}]`}<br/>
                                            {`[${index},${i}]`}
                                        </div>)}
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            })
            }
            {entities.map(cell => {
                return (
                    <DungeonEntity  key={cell.entity.id} style={cell.moveStyle} entity={cell.entity} />
                )
            })}
        </div>
    )
};
/*
            <div
                 className={`sprite cell ${player.type}`} style={playerStyle}>
                <div className={`entity ${player.entity.type} ${player.entity.direction}`} />
            </div>

 */
export default  Viewport;