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