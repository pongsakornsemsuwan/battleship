const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config.json')
const gameRouter = require('./routers/GameRouter')
const fleetRouter = require('./routers/FleetRouter')
const shootRouter = require('./routers/ShootRouter')

/* ********************************
EXPRESS CONFIGURATION
*******************************  */
const app = express()
app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(
	bodyParser.urlencoded({
		// to support URL-encoded bodies
		extended: true
	})
)

/* *******************************
API ROUTING
******************************* */
app.use('/api/game', gameRouter);
app.use('/api/fleet', fleetRouter);
app.use('/api/shoot', shootRouter);
app.use(function errorHandler (err, req, res, next) {
  console.log(err.stack);
  res.status(500).json({ error: err })
})

/* *******************************
MONGOOSE
******************************* */
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect(
  'mongodb://' + config.mongoUrl + ':' + config.mongoPort + '/' + config.mongoDatabase,
  { useMongoClient: true }
)

process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected on app termination')
		process.exit(0)
	})

	server.close(function() {
		console.log('Closed out remaining connections.')
		process.exit()
	})

	// if after
	setTimeout(function() {
		console.error('Could not close connections in time, forcefully shutting down')
		process.exit()
	}, 10 * 1000)
})

/* *******************************
START SERVER
******************************* */
const server = app.listen(8081, () => {
	console.log('Listening on port:8081')
})

module.exports = server
