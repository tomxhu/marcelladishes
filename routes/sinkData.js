var mongoose = require('mongoose');

var twilioService = require('../services/twilioService');
var utils = require('./utils/utils');

var EMPTYDISTANCE = 55;
var HALFWAYDISTANCE = 45

var SinkData = mongoose.model('SinkData', utils.sinkDataSchema);

Kitten.find(function (err, kittens) {
    if (err) {
        var sinkData = new SinkData({
            currentHeight: Number,
            time: Number,
            emptyBuffer: Number,
            messageTimeBuffer: Number
        });
        sinkData.save(function (err){
            if (err) {return console.error(err);}
        })
    }
    console.log(kittens)
})

var currentHeight = 0;
var time = 0;
var emptyBuffer = 0;
var messageTimeBuffer = 0;

module.exports = {
    sinkDataPost: function (request, response) {
        console.log('this is the req data', request.query);
        if (request.query.sensor1 < EMPTYDISTANCE || request.query.sensor2 < EMPTYDISTANCE) {
            console.log('<EMPTYDISTANCE');
            time += 1
            if (time > 360){
                if ((messageTimeBuffer % 120) === 0){
                    message = "Hey, there have been dishes in the sink for 6 hours";
                    twilioService.sendText(numbers[index], message);
                    messageTimeBuffer += 1;
                }
                emptyBuffer = 0;
            }
        }
        if (request.query.sensor1 < HALFWAYDISTANCE && request.query.sensor2 < HALFWAYDISTANCE) {
            console.log('<HALFWAYDISTANCE');
            if ((messageTimeBuffer % 120) === 0){
                message = "Hey, there's a lot of dishes in the sink";
                twilioService.sendText(numbers[index], message);
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
    }
}