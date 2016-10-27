var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var builder = require ('botbuilder');

var simpleApi = require('./routes/simpleapi');
var error = require ('./routes/error')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/today/simpleapi', simpleApi);

//chat bot
var connector = new builder.ChatConnector ({
    appId : process.env.appId ,
    appPassword : process.env.appPassword
});

var bot = new builder.UniversalBot (connector);

app.post ("/api/messages", connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    session.send("Hello World");
});

app.use ('*', error);

module.exports = app;
