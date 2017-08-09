const GameService = require('../services/GameService')
const FleetService = require('../services/FleetService')
const GameModel = require('../models/Game.model')
const mongoose = require('mongoose')
const config = require('../config.json')

beforeAll(function() {
  mongoose.Promise = global.Promise;
  mongoose.connect(
    'mongodb://' + config.mongoUrl + ':' + config.mongoPort + '/' + config.mongoDatabase,
    { useMongoClient: true }
  )
});

let ships = [];
let ship = {
  shipType: 'cruiser',
  coords:[{x:5,y:5},{x:6,y:5}],
  orientation: 'horizontal',
  hitCoords: []
};
ships.push(ship);

test('return correct grid', () => {
  let grid = GameService.getGrid(ships);
  expect(grid[5][5]).toBe(1)
  expect(grid[5][6]).toBe(1)
  expect(grid[4][4]).toBe(0)
  expect(grid[1][2]).toBe(0)
})

test('check adjacent', () => {

  let ship1 = {
    shipType: 'submarine',
    coords:[{x:4,y:4}],
    orientation: 'horizontal',
    hitCoords: []
  };

  let ship2 = {
    shipType: 'cruiser',
    coords:[{x:3,y:5},{x:4,y:5}],
    orientation: 'horizontal',
    hitCoords: []
  };

  let ship3 = {
    shipType: 'submarine',
    coords:[{x:4,y:6}],
    orientation: 'horizontal',
    hitCoords: []
  };

  let ship4 = {
    shipType: 'submarine',
    coords:[{x:3,y:3}],
    orientation: 'horizontal',
    hitCoords: []
  }

  let grid = GameService.getGrid(ships);

  expect(GameService.checkAdjacent(grid, ship1)).toBeFalsy();
  expect(GameService.checkAdjacent(grid, ship2)).toBeFalsy();
  expect(GameService.checkAdjacent(grid, ship3)).toBeFalsy();
  expect(GameService.checkAdjacent(grid, ship4)).toBeTruthy();
})

test('checkShipCount', () => {
  let ships = [];
  let battleship1 = {
    shipType: 'battleship',
    coords:[{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}],
    orientation: 'horizontal',
    hitCoords: []
  };
  let battleship2 = {
    shipType: 'battleship',
    coords:[{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}],
    orientation: 'horizontal',
    hitCoords: []
  };

  expect(GameService.checkShipCount(ships, battleship1)).toBeTruthy();
  ships.push(battleship1);
  expect(GameService.checkShipCount(ships, battleship2)).toBeFalsy();
})

test('shoot', async ()=>{
  let gameModel = new GameModel();
  gameModel.status = 'prepare'
  gameModel.totalShip = 0;
  gameModel.shipLeft = 0;
  gameModel.shootCount = 0;
  gameModel.hitCount = 0;
  gameModel.ships = [];
  let ship = {
    shipType: 'cruiser',
    coords:[{x:5,y:5},{x:6,y:5}],
    orientation: 'horizontal',
    hitCoords: []
  };

  let ship2 = {
    shipType: 'cruiser',
    coords:[{x:0,y:0},{x:0,y:1}],
    orientation: 'vertical',
    hitCoords: []
  };
  gameModel = await gameModel.save()
  gameModel = await FleetService.addShip(gameModel._id, ship);
  gameModel = await FleetService.addShip(gameModel._id, ship2);
  expect(await GameService.shoot(5,5,gameModel)).toEqual('Hit');
  expect(await GameService.shoot(4,5,gameModel)).toEqual('Miss');
  expect(await GameService.shoot(6,5,gameModel)).toEqual('You just sank the cruiser');
  expect(await GameService.shoot(0,0,gameModel)).toEqual('Hit');
  expect(await GameService.shoot(0,1,gameModel)).toEqual('Win ! You completed the game in 5 moves (missed 1 times )');

})
