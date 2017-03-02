'use strict';
var Alexa = require("alexa-sdk");
var APP_ID = "amzn1.ask.skill.46656ade-c839-4cee-a6ca-813b37a08443";
var request = require("request");
var axios = require("axios");
var _ = require("lodash");
var treatmentsByName = require("./treatments.json");

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', "How are you feeling today? For example, you can say, I'm feeling good!", "beep boop bop! I am a robot. Tee hee.")
        // this.emit('CreateInstantMe');
    },
    'CreateInstantMe': function() {
        var moodSlot = this.event.request.intent.slots.Mood;
        var moodName;
        if (moodSlot && moodSlot.value) {
            moodName = moodSlot.value.toLowerCase();
            if (_.includes(['very good', 'good', 'neutral', 'bad', 'very bad'], moodName)) {
                var _this = this;
                axios.post('http://8a6002f5.ngrok.io/instant_mood/alexa_create', {
                    data: _this.event
                  })
                  .then(function (response) {
                    var message = 'OK. Your InstantMe update of ' + moodName + ' has been recorded.';
                    _this.emit(':tellWithCard', message, "InstantMe Updated", message);
                  })
                  .catch(function (error) {
                    var message = 'There was an error updating your InstantMe.';
                    _this.emit(':tellWithCard', message, "InstantMe Update Failed", message);
                  });
            } else {
                this.emit('AMAZON.HelpIntent');
            }
        }
    },
    'GetDrugIntent': function () {
        console.log(treatmentsByName);
        console.log(this.event.request.intent)
        var drugSlot = this.event.request.intent.slots.RxDrug;
        var drugName;
        if (drugSlot && drugSlot.value) {
            drugName = drugSlot.value.toLowerCase();
            var _this = this;
            var id = treatmentsByName[drugName];
            console.log(id);
            var url = 'http://8a6002f5.ngrok.io/api/public/treatments/' + id + '/alexa_show';
            // var url = 'http://patientslikeme.com/api/public/treatments/' + id;
            request(url, function (error, response, body) {
              var body = JSON.parse(body);
              var short_definition = body["treatment"];
              // console.log(short_definition) you can see logs in Monitoring -> View logs in CloudWatch
              _this.emit(':tell', short_definition);
            })
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit('Unhandled');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'Unhandled': function() {
        var message = 'You can say, I\'m feeling very good, good, neutral, bad, or very bad.';
        this.emit(':ask', message, message);
    }
};