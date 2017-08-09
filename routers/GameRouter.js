const express = require('express');
const GameModel = require('../models/Game.model')
const GameService = require('../services/GameService')
const gameRouter = express.Router()

//init new game
gameRouter.get('/', async function(req, res, next) {
	try {
    let gameModel = new GameModel();
    gameModel.status = 'prepare'
    gameModel.totalShip = 0;
    gameModel.shipLeft = 0;
    gameModel.shootCount = 0;
    gameModel.hitCount = 0;
    gameModel = await gameModel.save();

		res.json(gameModel);
	} catch (err) {
    console.log(err.stack);
		next(err)
	}
})

//get game info
gameRouter.get('/:_id', async function(req, res, next) {
	try {
    let gameModel = await GameModel.findById(req.params._id);
		res.json(gameModel);
	} catch (err) {
		next(err)
	}
})

//get game grid
gameRouter.get('/:_id/grid', async function(req, res, next) {
  try {
    let gameModel = await GameModel.findById(req.params._id);
    let grid = GameService.getGrid(gameModel.ships);
    let gridString = '';
    for(let i=0;i<grid.length;i++){
      for(let j=0;j<grid[i].length;j++){
          gridString += grid[i][j] + ' ';
      }
      gridString += '\n';
    }
		res.send(gridString);
	} catch (err) {
		next(err)
	}
})
module.exports = gameRouter
