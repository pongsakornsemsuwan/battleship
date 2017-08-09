const express = require('express');
const GameModel = require('../models/Game.model')
const GameService = require('../services/GameService')
const shootRouter = express.Router()

// SHOOOOOT!!!
shootRouter.post('/', async (req,res,next) => {
	try {
		let id = req.body._id; //game id
		let x = +req.body.x;
		let y = +req.body.y;

		let game = await GameModel.findById( id );

		if(!game){
      res.status(500).send('game not found')
		}

    let result = await GameService.shoot(x, y, game);
    res.send(result);

	} catch (err) {
    next(err)
	}
})

module.exports = shootRouter
