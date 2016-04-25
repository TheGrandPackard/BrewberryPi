// server.js

// Initialization of model and dummy data


var temp1 = {name: "Fridge - Cold Side", id: 1, w1_id: "28001", temp: "68.0"};
var temp2 = {name: "Fridge - Hot Side", id: 2, w1_id: "28002", temp: "70.2"};
var temp3 = {name: "Outside Fridge", id: 3, w1_id: "28003", temp: "84.4"};

var temp_probes = [temp1, temp2, temp3];

var power1 = {name: "Fridge", id: 1, status:false};
var power2 = {name: "Heater", id: 2, status:false};
var power3 = {name: "Fans", id: 3, status:false};
var power4 = {name: "Unassigned", id: 4, status:false};

var power_statuses = [power1,power2,power3,power4];


// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// set the view engine to ejs
app.set('view engine', 'ejs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here
router.route('/power')

	.get(function(req, res) {

		res.json({ status: "ok", power_statuses: power_statuses})
	});
	
router.route('/power/:id')

	.get(function(req, res) {

		for(var i = 0; i < power_statuses.length; i++) {
			if(power_statuses[i].id == req.params.id) {
				res.json({ status: "ok", data: power_statuses[i]});
				return;
			}
		}

		res.json({ status: "error", message:"Power ID not found"});
	})
	.post(function(req, res) {

		for(var i = 0; i < power_statuses.length; i++) {
			if(power_statuses[i].id == req.params.id) {
				power_statuses[i].status = req.query.status;
				//TODO: Call hook to change GPIO status here.
				res.json({ status: "ok", data: power_statuses[i]});
				return;
			}
		}

		res.json({ status: "error", message:"Power ID not found"});
	});
	
router.route('/temp')

	.get(function(req, res) {

		res.json({ status: "ok", temp_probes: temp_probes})
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// index page 
app.get('/', function(req, res) {
  res.render('pages/index', {
      temp_probes: temp_probes,
			power_statuses: power_statuses
  });
});

// config page 
app.get('/config', function(req, res) {
	res.render('pages/config');
});

// about page 
app.get('/about', function(req, res) {
	res.render('pages/about');
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);