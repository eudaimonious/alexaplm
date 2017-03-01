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
        this.emit('CreateInstantMe')
    },
    'CreateInstantMe': function() {
        var options = {  
            url: 'https://8a6002f5.ngrok.io/api/v1/instant_mes/alexa_create',
            form: {
                email: 'me@example.com',
                password: 'myPassword'
            }
        };

        request.post(options, callback);
        console.log("create instant me slots", this.event.request.intent.slots);
        var moodSlot = this.event.request.intent.slots.Mood;
        var moodName;
        if (moodSlot && moodSlot.value) {
            moodName = moodSlot.value.toLowerCase();
        }
        this.emit(':ask', "How are you feeling today?", "You can say good, very good, neutral, bad or very bad.", true);
        
        console.log(this.event.request);
        console.log(this.event.request.intent);
        console.log(moodName);
        var speechOutput = "Glad to hear you're feeling " + moodName + ".";
        console.log(speechOutput);
        this.emit(':tellWithCard', speechOutput, "AlexaPLM", moodName);
    },
    // 'GetDrugIntent': function () {
    //     console.log(this.event.request.intent)
    //     var drugSlot = this.event.request.intent.slots.RxDrug;
    //     var drugName;
    //     if (drugSlot && drugSlot.value) {
    //         drugName = drugSlot.value.toLowerCase();
    //         var _this = this;
    //         request('http://patientslikeme.com/api/public/treatments/279', function (error, response, body) {
    //           var body = JSON.parse(body);
    //           var short_definition = body["treatment"]["short_definition"];
    //           // console.log(short_definition) you can see logs in Monitoring -> View logs in CloudWatch
    //           _this.emit(':tell', short_definition);
    //         })
    //     }
    // },
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
    },
    'Unhandled': function() {
        var message = 'Say stop to exit.';
        this.emit(':ask', message, message);
    }
};