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
        const enemyLevel = _.random(level, _.random(level - 1 ? level - 1 : level, level + 1));
        enemies.push({
            health: level * 30 + 40,
            // half of the enememies will be a level higher or lower (except on
            // level 1, where ~1/4 enemies are a level higher)
            level: enemyLevel,
            type: 'enemy',
            hp: 15 * enemyLevel,
            subType: _.random(0,1) === 0 ? 'skeleton' : 'slime',
            weapon: {
                baseDamage: () => (_.random(2,5) + 2 * enemyLevel),
                criticalDamage: 5 + 2 * enemyLevel,
            }
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

    const potions = [];
    for (let i = 0; i < 5; i++) {
        potions.push({ type: 'potion' });
    }

    const weaponTypes = [
        {
            name: 'Rusty Sword',
            baseDamage: () => _.random(5,10),
            criticalDamage: 10,
            cssClass: 'rs',
        },
        {
            name: 'Steel Sword',
            baseDamage: () => _.random(10,12),
            criticalDamage: 13,
            cssClass: 'sw',
        },
        {
            name: 'Bronze Sword',
            baseDamage: () => _.random(11,15),
            criticalDamage: 15,
            cssClass: 'bw',
        },
        {
            name: 'Steel Axe',
            baseDamage: () => _.random(10,13),
            criticalDamage: 15,
            cssClass: 'sa',
        },
        {
            name: 'Bronze Axe',
            baseDamage: () => _.random(10,18),
            criticalDamage: 18,
            cssClass: 'ba',
        },

    ];

    const weapons = [];
    // weapon types will vary based on the level passed to the parent function
    /* const qualifying = weaponTypes
        .filter(weapon => weapon.damage < level * 10 + 10)
        .filter(weapon => weapon.damage > level * 10 - 10); */
    for (let i = 0; i < _.random(1, 3); i++) {
        const weapon = Object.assign({}, weaponTypes[_.random(0, weaponTypes.length - 1)]);
        weapon.type = 'weapon';
        weapons.push(weapon);
    }

    const players = [
        {
            type: 'player',
            direction: 'left',
            hp: 30,
            hpMax: 30,
            armor: armors[0],
            weapon: weaponTypes[0]
        }
    ];

    // 2. randomly place all the entities on to floor cells on the game map.

    // we'll need to return the players starting co-ordinates
    let playerPosition = [];
    // [potions, enemies, weapons, exits, players, bosses].forEach(entities => {
    [players, enemies, weapons].forEach(entities => {
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
    if (map[deltaY][deltaX].type !== 'floor') return false;

    if (map[deltaY][deltaX].entity){
        if (map[deltaY][deltaX].entity.type === 'enemy' || map[deltaY][deltaX].entity.type === 'player') {
            let enemy = map[deltaY][deltaX];
            enemy.entity.hp -= entity.weapon.baseDamage();
            if ( enemy.entity.hp <= 0) enemy.entity = null
        }
        return false;
    }
    if (entity.type === 'player') state.playerPosition = [deltaX, deltaY];
    map[py][px].entity = null;
    map[deltaY][deltaX].entity = entity;
    entity.position = [deltaX, deltaY];
    return true;
};