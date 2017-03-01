'use strict';
var Alexa = require("alexa-sdk");
var APP_ID = "amzn1.ask.skill.46656ade-c839-4cee-a6ca-813b37a08443";
var request = require("request");

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', "How are you feeling today?");
    },
    'GetDrugIntent': function () {
        console.log(this.event.request.intent)
        var drugSlot = this.event.request.intent.slots.RxDrug;
        var drugName;
        if (drugSlot && drugSlot.value) {
            drugName = drugSlot.value.toLowerCase();
        }

        var _this = this;
        console.log(this.event)

        request('http://6de02801.ngrok.io/api/public/treatments/279', function (error, response, body) {
          var body = JSON.parse(body);
          var short_definition = body["treatment"]["short_definition"];
          // console.log(short_definition) you can see logs in Monitoring -> View logs in CloudWatch
          _this.emit(':tell', short_definition);
        })
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say, tell me about gabapentin, or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};