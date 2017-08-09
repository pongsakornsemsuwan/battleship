const express = require('express');
const GameModel = require('../models/Game.model')
const GameService = require('../services/GameService')
const FleetService = require('../services/FleetService')
const Constants = require('../utils/Constants')
const fleetRouter = express.Router()

const SHIP_SIZE = require('../config.json').shipSize;

//auto generate missing ships and put to game
fleetRouter.post('/gen', async(req, res, next) => {
	try {
		let game = await FleetService.autogen(req.body._id);
		res.json(game);
	}catch(err){
		next(err)
	}
})

//add ship manually one by one
fleetRouter.post('/', async (req,res,next) => {
	try {
		let id = req.body._id;
		let x = +req.body.x;
		let y = +req.body.y;
		let orientation = req.body.orientation;
		let shipType = req.body.shipType;

		let newShip = {
			shipType : shipType,
			orientation : orientation
		}

		let coords = [];

		for(let i=0;i<SHIP_SIZE[shipType];i++){
			if(orientation === Constants.ORIEN_HORIZONTAL){
				coords.push({x:x+i,y:+y});
			}else if(orientation === Constants.ORIEN_VERTICAL){
				coords.push({x:+x,y:y+i});
			}
		}

		newShip.coords = coords;

		let game = await FleetService.addShip(id, newShip);

		if(game){
			res.json(game);
		}else{
			res.json('cant place');
		}

	} catch (err) {
		next(err)
	}
})

module.exports = fleetRouter
