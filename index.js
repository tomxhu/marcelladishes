	var express = require('express')
var app = express();
var schedule = require('node-schedule');

var index = process.argv[2] || 0;

var numbers = [
	'9492926781', // Mike
	'7819568182', // Tommy
	'4105751082', // Dan
	'8572075659', // Vy
	'8573139589'  // Anu
]
var people = ['Mike', 'Tommy', 'Dan', 'Vy', 'Anu',];


// Twilio Credentials 
var accountSid = 'ACb673b6a7f9f908fa56af3d1a1cec6ca4'; 
var authToken = 'abd184322d8698d41ec413d11b72e6b6'; 
 
// require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

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

function sendText(number, body) {
	var now = new Date();
	var hour =  now.getHours();
	if (hour > 8) {
		client.messages.create({ 
		to: number, 
		from: "+15082326612", 
		body: body,   
		}, function(err, message) { 
			if (err) {
				console.log(err);
			}
			console.log('This is the messageID', message.sid); 
		});	
	} 	
};

function createMessage(dishes, trash) {
	return "It is " + dishes + "'s week on dishes and " +
			trash + "'s week on trash." 
}

var body;
var EMPTYDISTANCE = 59;
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
	sendText(numbers[2], body);
	// numbers.forEach(function (number){
	// 		sendText(number, body);
	// 		sleep(1000*60*2);
	// 	});
});

app.post('/sinkData', function (request, response) {
	console.log('this is the req data', request.query);
	if (request.query.sensor1 < EMPTYDISTANCE || request.query.sensor2 < EMPTYDISTANCE) {
		console.log('<EMPTYDISTANCE');
		time += 1
		if (time > 360){
			if ((messageTimeBuffer % 120) === 0){
				message = "Hey, there have been dishes in the sink for 6 hours";
				sendText(numbers[index], message);
				messageTimeBuffer += 1;
			}
			emptyBuffer = 0;
		}
	}
	if (request.query.sensor1 < HALFWAYDISTANCE && request.query.sensor2 < HALFWAYDISTANCE) {
		console.log('<HALFWAYDISTANCE');
		if ((messageTimeBuffer % 120) === 0){
			message = "Hey, there's a lot of dishes in the sink";
			sendText(numbers[index], message);
			messageTimeBuffer += 1;
		}
		emptyBuffer = 0;
	}
	if (request.query.sensor1 >= EMPTYDISTANCE && request.query.sensor2 >= EMPTYDISTANCE) {
		emptyBuffer += 1;
		messageTimeBuffer = 0;
		if (emptyBuffer > 15) {
			time = 0;
		}
	}
	console.log(time);
	// console.log(request.query.data);
	response.send()
});

app.listen(app.get('port'), function() {

	var text = schedule.scheduleJob(rule, function(){
		index += 1;
		index = index % 5;
		body = createMessage(people[index], people[(index + 2) % 5]);
		
		numbers.forEach(function (number){
			sendText(number, body);
			sleep(1000*60*2);
		});

		// sendText(numbers[1], body);
		
		
	});
  console.log("Node app is running at localhost:" + app.get('port'))
})



