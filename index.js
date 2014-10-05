var express = require('express')
var app = express();
var schedule = require('node-schedule');

var numbers = [
	'4105751082', // Dan
	'7819568182', // Tommy
	'9492926781', // Mike
	'8573139589', // Anu
	'8572075659', // Vy
]
var index = process.argv[2] || 0;
var people = ['Tommy', 'Mike', 'Anu', 'Vy', 'Dan'];


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

function sendText(number, body) {
	client.messages.create({ 
		to: number, 
		from: "+15082326612", 
		body: body,   
	}, function(err, message) { 
		if (err) {
			console.log(err);
		}
		console.log(message.sid); 
	});
};

function createMessage(dishes, trash) {
	return "It is " + dishes + "'s week on dishes and " +
			trash + "'s week on trash." 
}

var body;

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  body = createMessage(people[index], people[(index + 1) % 5]);
  response.send(body);
})

app.listen(app.get('port'), function() {
	var text = schedule.scheduleJob(rule, function(){
		body = createMessage(people[index], people[(index + 1) % 5]);
		
		numbers.forEach(function (number){
			sendText(number, body);
		});

		// sendText(numbers[1], body);
		
		index += 1;
		index = index % 5
	});
  console.log("Node app is running at localhost:" + app.get('port'))
})



