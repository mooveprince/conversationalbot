var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var builder = require ('botbuilder');
var request = require ('request');

var simpleApi = require('./routes/simpleapi');
var error = require ('./routes/error')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/today/simpleapi', simpleApi);

//chat bot
var connector = new builder.ChatConnector ({
    appId : process.env.APP_ID ,
    appPassword : process.env.APP_PASSWORD 
});

var bot = new builder.UniversalBot (connector);

var defaultLength = 5;

app.post ("/api/messages", connector.listen());

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i });

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        session.send ("Hi.. I am the tech trend bot. I can show you trending news from leading websites");
        session.beginDialog ("/help");
    }, function (session, results) {
        session.beginDialog ("/menu");
    }, function (session, results) {
        session.send ("Thank you for using Tech Trends");
    }
]);

bot.dialog ("/menu", [
    function (session) {
        builder.Prompts.choice (session, "From Which website you need the trending news ?", 
        "Hacker News|Twitter|Techcrunch|Techmeme|Product Hunt|(quit)");
    },
    function (session, results) {
        if (results.response && results.response.entity !== '(quit)') {
            session.beginDialog ("/"+results.response.entity);
        } else {
            session.endDialog ();
        }
    }
]);

bot.dialog ("/help", function (session) {
    session.endDialog ("Global commands available at anytime :\n\n* menu - Exits a demo and returns to the menu.\n* goodbye - End this conversation.\n* help - Displays these commands.");
});

bot.dialog ('/Twitter', function (session) {
    request ('https://techfeedyservice.herokuapp.com/tweet/trends', function (err, response, body) {
        if (!err && response.statusCode == 200) {
            var responseObject = JSON.parse(body);
            var trendsTweet = responseObject[0].trends;
            var slicedResult = trendsTweet.slice (0, defaultLength);
            var outputList = "";
            slicedResult.forEach (function (item) {
                outputList += "<a href=\'" +item.url+"\'>" + item.name + "</a>" + "\n\n";
            });
            session.send (outputList);
            
        } else {
            session.send ("Error in getting twitter trends");
        }

        session.endDialog();
    });
});

app.use ('*', error);

module.exports = app;
