import _ from "lodash";
import {MAP_HEIGHT, MAP_WIDTH} from './dungeon'

export const createEntities = (gameMap, level = 1) => {
    // 1. create the entities
    const movableEntities = [];
    const bosses = [];
    if (level === 4) {
        bosses.push({
            health: 400,
            level: 5,
            type: 'boss'
        });
    }

    const enemies = [];
    for (let i = 0; i < 7; i++) {
        enemies.push({
            health: level * 30 + 40,
            // half of the enememies will be a level higher or lower (except on
            // level 1, where ~1/4 enemies are a level higher)
            level: _.random(level, _.random(level - 1 ? level - 1 : level, level + 1)),
            type: 'enemy',
            subType: _.random(0,1) === 0 ? 'skeleton' : 'slime'
        });
    }

    const exits = [];
    if (level < 4) {
        exits.push({
            type: 'exit'
        });
    }

    const armors = [
        {
            name: 'leather',
            ac: 3,
        },
        {
            name: 'bronce',
            ac: 5,
        }
    ];

    const players = [
        {
            type: 'player',
            direction: 'left',
            hp: 25,
            hpMax: 30,
            str: 5,
            con: 5,
            armor: armors[0],
        }
    ];

    const potions = [];
    for (let i = 0; i < 5; i++) {
        potions.push({ type: 'potion' });
    }

    const weaponTypes = [
        {
            name: 'Laser Pistol',
            damage: 15
        },
        {
            name: 'Laser Rifle',
            damage: 19
        },
        {
            name: 'Plasma Pistol',
            damage: 26
        },
        {
            name: 'Plasma Rifle',
            damage: 28
        },
        {
            name: 'Electric ChainSaw',
            damage: 31
        },
        {
            name: 'Railgun',
            damage: 33
        },
        {
            name: 'Dark Energy Cannon',
            damage: 40
        },
        {
            name: 'B.F.G',
            damage: 43
        }
    ];

    const weapons = [];
    // weapon types will vary based on the level passed to the parent function
    const qualifying = weaponTypes
        .filter(weapon => weapon.damage < level * 10 + 10)
        .filter(weapon => weapon.damage > level * 10 - 10);
    for (let i = 0; i < 3; i++) {
        const weapon = Object.assign({}, qualifying[_.random(0, qualifying.length - 1)]);
        weapon.type = 'weapon';
        weapons.push(weapon);
    }

    // 2. randomly place all the entities on to floor cells on the game map.

    // we'll need to return the players starting co-ordinates
    let playerPosition = [];
    // [potions, enemies, weapons, exits, players, bosses].forEach(entities => {
    [players, enemies].forEach(entities => {
        while (entities.length) {
            const x = Math.floor(Math.random() * MAP_WIDTH);
            const y = Math.floor(Math.random() * MAP_HEIGHT);
            if (gameMap[y][x].type === 'floor') {
                const entity = entities.pop();
                entity.position = [x, y];
                if (entity.type === 'player') {
                    playerPosition = [x, y];
                }
                if (entity.type === 'enemy' || entity.type === 'player') movableEntities.push(entity);
                gameMap[y][x].entity = entity;
            }
        }
    });

    return {map: gameMap, playerPosition, movableEntities };
};

export const moveEntity = (vector, entity = {}, state = {}) => {
    const [x, y] = vector;
    const { map } = state;
    const [px, py]  = entity.position;
    // let entity = {...map[py][px].entity};
    switch(true) {
        case x < 0:
            entity.direction = 'left';
            break;
        case x > 0:
            entity.direction = '';
            break;
        default:
            break;
    }
    const deltaX = px + x;
    const deltaY = py + y;
    if (map[deltaY][deltaX].type === 'door') {
        map[deltaY][deltaX].type = 'floor';
        return false;
    }
    if (entity.type === 'player') {
        console.log(map[deltaY][deltaX].entity)
    }
    if (map[deltaY][deltaX].type !== 'floor' || map[deltaY][deltaX].entity){
        /* if (entity.type === 'player')  console.clear();
        console.log('Entity',entity.type,'Delta Entity', map[deltaY][deltaX].type); */
        return false;
    }
    if (entity.type === 'player') state.playerPosition = [deltaX, deltaY];
    map[py][px].entity = null;
    map[deltaY][deltaX].entity = entity;
    entity.position = [deltaX, deltaY];
    return true;
};