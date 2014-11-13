var express = require('express')
var app = express();
var schedule = require('node-schedule');

var twilioService = require('./twilioService');
var sinkData = require('./routes/sinkData');

var index = process.argv[2] || 0;

var numbers = [
	'4105751082', // Dan
	'8572075659', // Vy
	'8573139589',  // Anu
	'9492926781', // Mike
	'7819568182' // Tommy
]
var people = ['Dan', 'Vy', 'Anu', 'Mike', 'Tommy'];

// sets up rule
var rule = {
	hour: 9,
	minute: 0,
	dayOfWeek: 0
}

var testRule = new schedule.RecurrenceRule();
rule.second = 0;

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
//
//function sendText(number, body) {
//	var now = new Date();
//	var hour =  now.getHours();
//	if (hour > 8) {
//		client.messages.create({
//		to: number,
//		from: "+15082326612",
//		body: body,
//		}, function(err, message) {
//			if (err) {
//				console.log(err);
//			}
//			console.log('This is the messageID', message);
//		});
//	}
//};

function createMessage(dishes, trash) {
	return "It is " + dishes + "'s week on dishes and " +
			trash + "'s week on trash." 
}

var body;
var EMPTYDISTANCE = 55;
var HALFWAYDISTANCE = 45
var currentHeight;
var time = 0;
var emptyBuffer = 0;
var messageTimeBuffer = 0;


app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  body = createMessage(people[index], people[(index + 2) % 5]);
  response.send(body);
});

app.get('/sendText', function(request, response) {
	body = createMessage(people[index], people[(index + 2) % 5]);
	response.send('sending texts');
	twilioService.sendText(numbers[4], body);
	//numbers.forEach(function (number){
	//	twilioService.sendText(number, body);
	//		sleep(1000*60*2);
	//	});
});

app.post('/sinkData', sinkData.sinkDataPost);

app.listen(app.get('port'), function() {

	var text = schedule.scheduleJob(rule, function(){
		index += 1;
		index = index % 5;
		body = createMessage(people[index], people[(index + 2) % 5]);
		
		numbers.forEach(function (number){
			twilioService.sendText(number, body);
			sleep(1000*60*2);
		});

		// twilioService.sendText(numbers[1], body);
		
		
	});
  console.log("Node app is running at localhost:" + app.get('port'))
})



