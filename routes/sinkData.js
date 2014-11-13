var storage = require('node-persist');
storage.initSync();

var EMPTYDISTANCE = 55;
var HALFWAYDISTANCE = 45
var initValues = ['currentHeight', 'time', 'emptyBuffer', 'messageTimeBuffer']

initValues.forEach(function(values){
    if(!storage.getItem(values)){
        storage.setItem(values,0);
    }
});

var currentHeight = storage.getItem('currentHeight');
var time = storage.getItem('time');
var emptyBuffer = storage.getItem('emptyBuffer');
var messageTimeBuffer = storage.getItem('messageTimeBuffer');

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
        storage.setItem('currentHeight', currentHeight);
        storage.setItem('time', time);
        storage.setItem('emptyBuffer', emptyBuffer);
        storage.setItem('messageTimeBuffer', messageTimeBuffer);
        response.send()
    }
}