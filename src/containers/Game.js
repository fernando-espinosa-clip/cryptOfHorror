import React, { Component } from 'react'
import _ from 'lodash'
import Viewport from '../components/Viewport'
import LifeBar from '../components/LifeBar'
import './Game.scss'
import { createEntities, moveEntity, getEntitiesByType } from '../helpers/entities'
import { createMap, madeShadowMist } from '../helpers/dungeon'


const createLevel = (levelNumber = 1) => {
    const level = createEntities(createMap(), levelNumber);
    let state = {
        map: level.map,
        movableEntities: level.movableEntities,
        playerPosition: level.playerPosition,
        viewPortCords: [0, 0],
        viewPort: {
            width: 30,
            height: 18,
        }
    };
    const [px, py] = state.playerPosition;
    state = moveViewport([px - Math.floor(state.viewPort.width / 2), py - Math.floor(state.viewPort.height / 2)], state);
    return state;
};


const moveViewport = (vector, state) => {
    const [x, y] = vector;
    const { map, viewPort: { height, width } } = state;
    let { viewPortCords: [vpx, vpy] } = state;
    vpx += x;
    vpy += y;
    if (vpx < 0 ) vpx = 0;
    if (vpx > map[0].length - width) vpx = map[0].length - width;
    if (vpy < 0 ) vpy = 0;
    if (vpy > map.length - height) vpy = map.length - height;
    state.viewPortCords = [vpx, vpy];
    return state;
};


const playerInput = (vector, state = {}) => {
    const { map } = state;
    if (moveEntity(vector, state.movableEntities[0], state)) moveViewport(vector, state);
    const entities = getEntitiesByType(map,['enemy', 'player']);
    entities.forEach(entity => {
        let dice = _.random(0,100);
        let willMove = false;
        let vector = [0,0];
        switch(entity.subType) {
            case 'slime':
                willMove = dice <  20;
                dice = _.random(0,100);
                if (dice < 85) vector = [0,-1];
                if (dice < 70) vector = [1,0];
                if (dice < 35) vector = [-1,0];
                if (dice >= 85) vector = [0,1];
                break;
            case 'skeleton':
                willMove = dice < 60;
                dice = _.random(0,100);
                if (dice < 75) vector = [0,-1];
                if (dice < 50) vector = [1,0];
                if (dice < 25) vector = [-1,0];
                if (dice >= 75) vector = [0,1];
                break;
            default:
                break;
        }
        if (willMove) moveEntity(vector, entity, state)
    })

};

class Game extends Component {
    state = createLevel();

    handleKeyPress = (e) => {
        let state = this.state;
        switch (e.keyCode) {
            // north
            case 38:
            case 87:
                playerInput([0, -1], state);
                this.setState(state);
                break;
            // east
            case 39:
            case 68:
                playerInput([1, 0], state);
                this.setState(state);
                break;
            // south
            case 40:
            case 83:
                playerInput([0, 1], state);
                this.setState(state);
                break;
            // west
            case 37:
            case 65:
                playerInput([-1, 0], state);
                this.setState(state);
                break;
            default:
                return;
        }
    };

    componentDidMount() {
        window.addEventListener('keydown', _.throttle(this.handleKeyPress, 100));
       //  window.addEventListener('resize', _.debounce(this.handleResize, 500));
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', _.throttle(this.handleKeyPress, 100));
        // window.removeEventListener('resize', _.debounce(this.handleResize, 500));
    }

    render() {
        const { map, viewPortCords, viewPort: {width, height} } = this.state;
        const player = getEntitiesByType(map, ['player']).pop();
        madeShadowMist(map);
        return (
            <div className='app'>
                <div className='flex-container'>
                    <div className='hud'>
                        <div className='character-info'>
                            <div className='background'/>
                            <div className={`weapon ${player.weapon.cssClass}`}/>
                            <LifeBar value={player.hp} max={player.hpMax} />
                        </div>
                    </div>
                   <Viewport viewPortCords={viewPortCords} width={width} height={height} map={map} />
                </div>
            </div>
        )
    }
}

export default Game