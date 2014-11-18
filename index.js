var express = require('express');
var app = express();
var schedule = require('node-schedule');
var mongoose = require('mongoose');
var Q = require('q');
var _ = require('underscore');

var mongoUrl = process.env.MONGOLAB_URI || 'mongodb://localhost/test';

mongoose.connect(mongoUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('db opened');
});



var utils = require('./utils/utils');
var twilioService = require('./services/twilioService');
var sinkData = require('./routes/sinkData');

var body;
var index;

var ClearTimeData = mongoose.model('ClearTimeData', utils.clearTimeSchema);

var IndexData = mongoose.model('IndexData', utils.indexSchema);
utils.initIndex(IndexData).then(function(dbIndex){
	index = dbIndex;
});

console.log('this is index', index);

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'));

sinkData.initializeLocalVars(ClearTimeData);

app.get('/', function(request, response) {
	body = utils.createMessage(utils.people[index], utils.people[(index + 2) % 5]);
	ClearTimeData.find({}, function(err, dbClearTimeData){
		console.log(dbClearTimeData[0].__id);
		var text = _.omit(dbClearTimeData[0], ['__v', '_id']).toString();
		response.send(body + text);
	})

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

app.post('/sinkData', function(request, response){
	console.log('while posting: ', index);
	console.log(utils.people[index]);
	sinkData.sinkDataPost(request, response, ClearTimeData, utils.people[index]);
});

app.listen(app.get('port'), function() {

	var text = schedule.scheduleJob(utils.rule, function(){
		index += 1;
		index = index % 5;

		IndexData.update({}, {index: index}, function(err){
			if (err) {console.log(err)}
		});

		body = utils.createMessage(utils.people[index], utils.people[(index + 2) % 5]);

		utils.numbers.forEach(function (number){
			twilioService.sendText(number, body);
			utils.sleep(1000*60*2);
		});

		// twilioService.sendText(utils.numbers[1], body);

	});
  console.log("Node app is running at localhost:" + app.get('port'));
});





