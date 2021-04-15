import React, { Component } from "react";
import _ from "lodash";
import Viewport from "../components/Viewport";
import LifeBar from "../components/LifeBar";
import "./Game.scss";
import {
  createEntities,
  moveEntity,
  getEntitiesByType
} from "../helpers/entities";
import { createMap, madeShadowMist } from "../helpers/dungeon";
import Checkbox from "../components/Checkbox";
import Music from "../components/Music";
import StartScreen from "../components/StartScreen";

const level = createEntities(createMap(), 1);
const map = level.map;

const setViewPort = state => {
  const {
    viewPortCords: [xcor, ycor],
    viewPort: { width, height }
  } = state;
  let cells = [];
  map
    .filter((v, y) => y > ycor && y < ycor + height + 3)
    .forEach((element, index) => {
      element
        .filter((v, x) => x > xcor && x < xcor + width + 3)
        .forEach((cell, i) => {
          cell.x = i - 1;
          cell.y = index - 1;
          cells.push(cell);
        });
    });
  state.map = cells;
};

const createLevel = () => {
  let state = {
    movableEntities: level.movableEntities,
    playerPosition: level.playerPosition,
    viewPortCords: [0, 0],
    viewPort: {
      width: 20,
      height: 10
    },
    showShadows: true,
    displayDevInfo: false,
    startLevel: false
  };
  // const [px, py] = state.playerPosition;
  centerViewport(state); // moveViewport([px - Math.floor(state.viewPort.width / 2), py - Math.floor(state.viewPort.height / 2)], state);
  setViewPort(state);
  return state;
};

/* const moveViewport = (vector, state) => {
  const [x, y] = vector;
  const {
    map,
    viewPort: { height, width }
  } = state;
  let {
    viewPortCords: [vpx, vpy]
  } = state;
  vpx += x;
  vpy += y;
  if (vpx < 0) vpx = 0;
  if (vpx > map[0].length - width) vpx = map[0].length - width;
  if (vpy < 0) vpy = 0;
  if (vpy > map.length - height) vpy = map.length - height;
  state.viewPortCords = [vpx, vpy];
  return state;
};
*/
const centerViewport = state => {
  const { viewPort, viewPortCords } = state;
  const player = getEntitiesByType(map, ["player"]).pop();
  const midWidth = Math.floor(viewPort.width / 2);
  const midHeight = Math.floor(viewPort.height / 2);
  viewPortCords[0] = player.position[0] - midWidth - 1;
  viewPortCords[1] = player.position[1] - midHeight - 1;
};

const entitiesAction = state => {
  const entities = getEntitiesByType(map, ["enemy"]);
  entities.forEach(entity => {
    let dice = _.random(0, 100);
    let willMove = false;
    let vector = [0, 0];
    entity.action = "nothing";
    switch (entity.subType) {
      case "slime":
        if (Date.now() - entity.timer < 300) return null;
        willMove = dice < 20;
        dice = _.random(0, 100);
        if (dice < 85) vector = [0, -1];
        if (dice < 70) vector = [1, 0];
        if (dice < 35) vector = [-1, 0];
        if (dice >= 85) vector = [0, 1];
        break;
      case "skeleton":
        if (Date.now() - entity.timer < 2000) return null;
        willMove = true; //dice < 60;
        dice = _.random(0, 100);
        if (dice < 75) vector = [0, -1];
        if (dice < 50) vector = [1, 0];
        if (dice < 25) vector = [-1, 0];
        if (dice >= 75) vector = [0, 1];
        break;
      default:
        break;
    }
    entity.timer = Date.now();
    if (willMove) {
      moveEntity(vector, entity, map, state);
    }
  });
  madeShadowMist(map);
};

let playerVector = [0, 0];

const playerInput = (state = {}) => {
  const player = getEntitiesByType(map, ["player"]).pop();
  player.action = "nothing";
  if (playerVector[0] !== 0 || playerVector[1] !== 0) {
    if (moveEntity(playerVector, player, map, state)) centerViewport(state);
  }
  entitiesAction(state);
  setViewPort(state);
  playerVector = [0, 0];
};

class Game extends Component {
  state = createLevel();

  enternalLoop = () => {
    let state = this.state;
    playerInput(state);
    // console.log(state)
    this.setState(state);
  };

  handleKeyPress = e => {
    if (!e.repeat) {
      // let state = this.state;
      switch (e.keyCode) {
        // north
        case 38:
        case 87:
          playerVector = [0, -1];
          /* playerInput([0, -1], state);
          this.setState(state);*/
          break;
        // east
        case 39:
        case 68:
          playerVector = [1, 0];
          /* playerInput([1, 0], state);
          this.setState(state);*/
          break;
        // south
        case 40:
        case 83:
          playerVector = [0, 1];
          /*playerInput([0, 1], state);
          this.setState(state);*/
          break;
        // west
        case 37:
        case 65:
          playerVector = [-1, 0];
          /* playerInput([-1, 0], state);
          this.setState(state);*/
          break;
        default:
          return;
      }
    }
  };

  componentDidMount() {
    window.addEventListener("keydown", _.throttle(this.handleKeyPress, 100));
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", _.throttle(this.handleKeyPress, 100));
  }

  render() {
    const {
      map: gameMap,
      showShadows,
      displayDevInfo,
      startLevel
    } = this.state;
    const player = getEntitiesByType(map, ["player"]).pop();
    return (
      <div className="app">
        {!startLevel && (
          <StartScreen
            onClick={() =>
              this.setState({ startLevel: true }, () =>
                setInterval(this.enternalLoop, 100)
              )
            }
          />
        )}
        <Music startMusic={startLevel} />
        {startLevel && (
          <div className="flex-container">
            <div className="hud">
              <div className="character-info">
                <div className="background" />
                <div className={`weapon ${player.weapon.cssClass}`} />
                <LifeBar value={player.hp} max={player.hpMax} />
              </div>
              <div className="dev-info">
                <Checkbox
                  label="shadows"
                  value={showShadows}
                  onClick={() => this.setState({ showShadows: !showShadows })}
                />
                <Checkbox
                  label="Extra info."
                  value={displayDevInfo}
                  onClick={() =>
                    this.setState({ displayDevInfo: !displayDevInfo })
                  }
                />
              </div>
            </div>
            <Viewport
              player={player}
              map={gameMap}
              showShadows={showShadows}
              displayDevInfo={displayDevInfo}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Game;
