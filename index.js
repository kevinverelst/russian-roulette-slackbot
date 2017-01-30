var Botkit = require('botkit');
// A non comitted required config file with the apiToken for security and shit
var config = require('./config');
var players = [];
var _bot;
var controller = Botkit.slackbot({
    debug: false
    //include "log: false" to disable logging
    //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
    token: config.apiToken,
}).startRTM();

// give the bot something to listen for.
controller.hears('hello', ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
    bot.reply(message, 'Hello yourself.');
});

controller.hears('roulette', ['direct_message'], function (bot, message) {
    _bot = bot.startConversation(message, askPlayers);
});

var askPlayers = function (err, convo) {
    if (players.length === 0) {
        updatePlayers('', convo);
    } else {
        convo.ask(`Are ${players.toString()} the correct players? (y/n)`, function (response, convo) {
            console.log(response);
            if (response.text === 'y') {
                convo.say('Great!');
                playRoulette(response, convo);
                convo.next();
            }
            if (response.text === 'n') {
                convo.say('Darn it! Let\'s update.');
                updatePlayers(response, convo);
                convo.next();
            }
        });
    }
};

var updatePlayers = function (response, convo) {
    convo.ask('Who are the players? (eg: joske,jefke)', function (response, convo) {
        players = response.text.split(',');
        playRoulette(response, convo);
        convo.next();
    });
};

var playRoulette = function (response, convo) {
    var index = Math.floor(Math.random() * 3);
    console.log('index: ', index);
    convo.say(`The loser is ${players[index]}!`);
    // _bot.startPrivateConversation(message, notifyLoser);
};

var notifyLoser = function (err, convo) {
    convo.say('Hahaa, you\'re the loser');
};

