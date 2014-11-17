var express = require('express');
var app = express();
var schedule = require('node-schedule');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('db opened');
});



var utils = require('./utils/utils');
var twilioService = require('./services/twilioService');
var sinkData = require('./routes/sinkData');

var index = 0;
var body;

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'));

sinkData.initializeLocalVars();

app.get('/', function(request, response) {
  body = utils.createMessage(utils.people[index], utils.people[(index + 2) % 5]);
  response.send(body);
});

app.get('/sendText', function(request, response) {
	body = utils.createMessage(utils.people[index], utils.people[(index + 2) % 5]);
	response.send('sending texts');
	twilioService.sendText(utils.numbers[4], body);
	//utils.numbers.forEach(function (number){
	//	twilioService.sendText(number, body);
	//		utils.sleep(1000*60*2);
	//	});
});

app.post('/sinkData', sinkData.sinkDataPost);

app.listen(app.get('port'), function() {

	var text = schedule.scheduleJob(utils.rule, function(){

		index += 1;
		index = index % 5;

		body = utils.createMessage(utils.people[index], utils.people[(index + 2) % 5]);

		utils.numbers.forEach(function (number){
			twilioService.sendText(number, body);
			utils.sleep(1000*60*2);
		});

		// twilioService.sendText(utils.numbers[1], body);
		
	});
  console.log("Node app is running at localhost:" + app.get('port'));
})



