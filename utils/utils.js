module.exports = {

    numbers: [
        '4105751082', // Dan
        '8572075659', // Vy
        '8573139589',  // Anu
        '9492926781', // Mike
        '7819568182' // Tommy
    ],

    people: ['Dan', 'Vy', 'Anu', 'Mike', 'Tommy'],

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
    }

}