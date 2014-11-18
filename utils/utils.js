var mongoose = require('mongoose');
var Q = require('q');

module.exports = {

    numbers: [

        '8572075659', // Vy
        '8573139589',  // Anu
        '9492926781', // Mike
        '7819568182', // Tommy
        '4105751082', // Dan
    ],

    people: ['Vy', 'Anu', 'Mike', 'Tommy', 'Dan'],

    rule: {
        hour: 9,
        minute: 0,
        dayOfWeek: 0
    },
    sleep: function(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
                break;
            }
        }
    },

    createMessage: function (dishes, trash) {
        return "It is " + dishes + "'s week on dishes and " +
            trash + "'s week on trash."
    },
    sinkDataSchema: mongoose.Schema({
        id: Number,
        currentHeight: Number,
        time: Number,
        emptyBuffer: Number,
        messageTimeBuffer: Number
    }),
    clearTimeSchema: mongoose.Schema({
        Dan: Number,
        Vy: Number,
        Anu: Number,
        Mike: Number,
        Tommy: Number
    }),
    initClearTime: function(ClearTimeData){
        ClearTimeData.find({}, function(err, dbClearTimeData){
            if (dbClearTimeData.length === 0){
                var clearTimeData = new ClearTimeData({
                    Dan: 0,
                    Vy: 0,
                    Anu: 0,
                    Mike: 0,
                    Tommy: 0
                });

                clearTimeData.save(function (err){
                    if (err) {return console.error(err);}
                    console.log('saved')
                });
            }
        });
    },
    indexSchema: mongoose.Schema({
        index: Number
    }),
    initIndex: function(IndexData){
        var deferred = Q.defer();

        IndexData.find({}, function(err, dbIndexData){
            if (dbIndexData.length === 0){
                var indexData = new IndexData({
                    index: 0
                });
                indexData.save(function (err){
                    if (err) {return console.error(err);}
                    console.log('saved')
                });
                deferred.resolve(0);

            } else {
                console.log(dbIndexData[0].index);
                deferred.resolve(dbIndexData[0].index);
            }
        });

        return deferred.promise
    }


}