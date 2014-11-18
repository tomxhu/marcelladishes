var mongoose = require('mongoose');

var twilioService = require('../services/twilioService');
var utils = require('../utils/utils');

var EMPTYDISTANCE = 55;
var HALFWAYDISTANCE = 45

var SinkData = mongoose.model('SinkData', utils.sinkDataSchema);


var currentHeightSensor1 = 0;
var currentHeightSensor2 = 0;
var time = 0;
var emptyBuffer = 0;
var messageTimeBuffer = 0;


module.exports = {
    initializeLocalVars: function(ClearTimeData){

        utils.initClearTime(ClearTimeData);

        SinkData.find({}, function (err, sinkData) {
            if (sinkData.length === 0) {
                console.log('init data');
                var sinkData = new SinkData({
                    currentHeightSensor1: 0,
                    currentHeightSensor2: 0,
                    time: 0,
                    emptyBuffer: 0,
                    messageTimeBuffer: 0
                });
                sinkData.save(function (err){
                    if (err) {return console.error(err);}
                    console.log('saved')
                })
            } else {
                console.log(sinkData);
                currentHeight = sinkData[0].currentHeight;
                time = sinkData[0].time;
                emptyBuffer = sinkData[0].emptyBuffer;
                messageTimeBuffer = sinkData[0].messageTimeBuffer;
            }
        });
    },
    sinkDataPost: function (request, response, ClearTimeData, person) {
        console.log('this is the req data', request.query);

        currentHeightSensor1 = request.query.sensor1;
        currentHeightSensor2 = request.query.sensor2;

        if (currentHeightSensor1 < EMPTYDISTANCE || currentHeightSensor2 < EMPTYDISTANCE) {
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
        if (currentHeightSensor1 < HALFWAYDISTANCE && currentHeightSensor2 < HALFWAYDISTANCE) {
            console.log('<HALFWAYDISTANCE');
            if ((messageTimeBuffer % 120) === 0){
                message = "Hey, there's a lot of dishes in the sink";
                twilioService.sendText(numbers[index], message);
                messageTimeBuffer += 1;
            }
            emptyBuffer = 0;
        }
        if (currentHeightSensor1 >= EMPTYDISTANCE && currentHeightSensor2 >= EMPTYDISTANCE) {
            if (time !== 0){
                emptyBuffer += 1;
                messageTimeBuffer = 0;
                if (emptyBuffer > 5) {

                    var updateKey = {};
                    console.log(person);
                    updateKey[person] = time;
                    console.log(updateKey);
                    ClearTimeData.update({}, updateKey, function(err){
                        if (err) {console.log(err)}
                    });

                    time = 0;
                }
            }
        }

        SinkData.update({}, {
            currentHeightSensor1: currentHeightSensor1,
            currentHeightSensor2: currentHeightSensor2,
            time  : time,
            emptyBuffer  : emptyBuffer,
            messageTimeBuffer  : messageTimeBuffer
        }, function(err){
            if(err) {console.log(err)}
        });

        console.log(time);

        response.send()
    }
}