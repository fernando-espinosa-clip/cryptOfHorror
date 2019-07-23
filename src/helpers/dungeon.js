import _ from "lodash";
import { getEntitiesByType } from "./entities";

export const MAP_WIDTH = 70;
export const MAP_HEIGHT = 50;
export const MAX_ROOMS = 50;
export const ROOM_SIZE_RANGE = [4, 12];
export const VISITED_PLACES_OPACITY = 0.4;

export const growMap = (grid, seedRooms, counter = 1, maxRooms = MAX_ROOMS) => {
  if (counter + seedRooms.length > maxRooms || !seedRooms.length) {
    return grid;
  }

  grid = createRoomsFromSeed(grid, seedRooms.pop());
  seedRooms.push(...grid.placedRooms);
  counter += grid.placedRooms.length;
  return growMap(grid.grid, seedRooms, counter);
};

export const createMap = () => {
  let map = [];
  const [min, max] = ROOM_SIZE_RANGE;
  for (let y = 0; y < MAP_HEIGHT; y++) {
    map.push([]);
    for (let x = 0; x < MAP_WIDTH; x++) {
      map[y].push({
        type: "nothing",
        opacity: _.random(0.5, 0.8),
        id: _.random(0, 1000000)
      });
    }
  }

  const firstRoom = {
    x: _.random(1, MAP_WIDTH - max - 15),
    y: _.random(1, MAP_HEIGHT - max - 15),
    height: _.random(min, max),
    width: _.random(min, max)
  };

  map = placeCells(map, firstRoom, "floor", (x, y) => floorTypes(x, y));

  map = growMap(map, [firstRoom]);

  map = buildWalls(map);
  return map;
};

export const isWall = (grid, x, y) => {
  const currentCell = grid[y][x];
  if (currentCell.type === "nothing") {
    if (y - 1 < 0) return { result: true, isButton: true };
    if (y + 1 >= MAP_HEIGHT) return { result: true, isButton: true };
    if (x - 1 < 0) return { result: true, isButton: true };
    if (x + 1 >= MAP_WIDTH) return { result: true, isButton: true };
    if (grid[y + 1][x].type === "nothing" && grid[y - 1][x].type === "floor")
      return { result: true, isButton: true };
    if (grid[y - 1][x].type === "floor")
      return { result: true, isButton: false };
    if (grid[y + 1][x].type === "floor")
      return { result: true, isButton: false };
    if (grid[y][x - 1].type === "floor")
      return { result: true, isButton: false };
    if (grid[y][x + 1].type === "floor")
      return { result: true, isButton: false };
  }
  return { result: false, isButton: false };
};

export const wallTypes = isButton => {
  if (isButton) return `tile0${_.random(0, 1)}`;
  const roulette = _.random(1, 100);
  if (roulette < 85) return `tile0${_.random(0, 2)}`;
  if (roulette >= 85 && roulette < 95) return `tile0${_.random(3, 6)}`;
  return `tile0${_.random(7, 9)}`;
};

export const floorTypes = (x, y) => {
  const plus = y % 2 === 0 ? 0 : 1;
  return (x + plus) % 2 === 0 ? `tile00` : `tile01`;
};

export const doorTypes = type => {
  if (type === "h") return "tile00";
  return "tile01";
};

export const buildWalls = grid => {
  for (let y = MAP_HEIGHT - 1; y >= 0; y--) {
    for (let x = MAP_WIDTH - 1; x >= 0; x--) {
      const wall = isWall(grid, x, y);
      if (wall.result)
        grid[y][x] = {
          ...grid[y][x],
          ...{ type: "wall", variant: wallTypes(wall.isButton) }
        };
    }
  }
  return grid;
};

export const isValidRoomPlacement = (grid, { x, y, width = 1, height = 1 }) => {
  // check if on the edge of or outside of the grid
  if (y < 1 || y + height > grid.length - 1) {
    return false;
  }
  if (x < 1 || x + width > grid[0].length - 1) {
    return false;
  }

  // check if on or adjacent to existing room
  for (let i = y - 1; i < y + height + 1; i++) {
    for (let j = x - 1; j < x + width + 1; j++) {
      if (grid[i][j].type === "floor") {
        return false;
      }
    }
  }
  // all grid cells are clear
  return true;
};

export const placeCells = (
  grid,
  { x, y, width = 1, height = 1 },
  type = "floor",
  variant = ""
) => {
  for (let i = y; i < y + height; i++) {
    for (let j = x; j < x + width; j++) {
      grid[i][j] = {
        ...grid[i][j],
        ...{
          type,
          variant:
            variant && {}.toString.call(variant) === "[object Function]"
              ? variant(j, i)
              : variant
        }
      };
    }
  }
  return grid;
};

export const createRoomsFromSeed = (
  grid,
  { x, y, width, height },
  range = ROOM_SIZE_RANGE
) => {
  // range for generating the random room heights and widths
  const [min, max] = range;

  // generate room values for each edge of the seed room
  const roomValues = [];

  const north = { height: _.random(min, max), width: _.random(min, max) };
  north.x = _.random(x, x + width - 1);
  north.y = y - north.height - 1;
  north.doorx = _.random(
    north.x,
    Math.min(north.x + north.width, x + width) - 1
  );
  north.doory = y - 1;
  north.doorType = "h";
  roomValues.push(north);

  const east = { height: _.random(min, max), width: _.random(min, max) };
  east.x = x + width + 1;
  east.y = _.random(y, height + y - 1);
  east.doorx = east.x - 1;
  east.doory = _.random(east.y, Math.min(east.y + east.height, y + height) - 1);
  east.doorType = "v";
  roomValues.push(east);

  const south = { height: _.random(min, max), width: _.random(min, max) };
  south.x = _.random(x, width + x - 1);
  south.y = y + height + 1;
  south.doorx = _.random(
    south.x,
    Math.min(south.x + south.width, x + width) - 1
  );
  south.doory = y + height;
  south.doorType = "h";
  roomValues.push(south);

  const west = { height: _.random(min, max), width: _.random(min, max) };
  west.x = x - west.width - 1;
  west.y = _.random(y, height + y - 1);
  west.doorx = x - 1;
  west.doory = _.random(west.y, Math.min(west.y + west.height, y + height) - 1);
  west.doorType = "v";
  roomValues.push(west);

  const placedRooms = [];
  roomValues.forEach(room => {
    if (isValidRoomPlacement(grid, room)) {
      // place room
      grid = placeCells(grid, room, "floor", (x, y) => floorTypes(x, y));
      // place door
      grid = placeCells(grid, { x: room.doorx, y: room.doory }, "door", () =>
        doorTypes(room.doorType)
      );
      // need placed room values for the next seeds
      placedRooms.push(room);
    }
  });
  return { grid, placedRooms };
};

export const madeShadowMist = map => {
  const player = getEntitiesByType(map, ["player"]).pop();
  return map.map((row, i) =>
    row.map((cell, j) => {
      const distance =
        Math.abs(player.position[1] - i) + Math.abs(player.position[0] - j);
      cell.distanceFromPlayer = distance;
      cell.position = [j, i];
      if (distance <= 5) cell.visited = true;
      return cell;
    })
  );
};
