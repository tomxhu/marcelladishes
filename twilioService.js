var schedule = require('node-schedule');
var twilio = require('twilio');


// Twilio Credentials
var accountSid = 'ACb673b6a7f9f908fa56af3d1a1cec6ca4';
var authToken = 'abd184322d8698d41ec413d11b72e6b6';

// require the Twilio module and create a REST client
var client = twilio(accountSid, authToken);

module.exports = {
        sendText: function(number, body) {
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
                    console.log('This is the messageID', message);
                });
            }
        }
}