'use strict';

const lexResponses = require('./lexResponses');
const _ = require('lodash');

function getButtons(options) {
    let buttons = [];
    _.forEach(options, option => {
        buttons.push({
            text: option.txt,
            value: option.val
        });
    });
    console.log("them buttons", buttons);
    return buttons;
}

function getOptions(title, imageURL, types) {
    return {
        title,
        imageURL,
        buttons: getButtons(types)
    }
}

function buildValidationResult(isValid, violatedSlot, messageContent, options) {
    if (messageContent == null) {
        return {
            isValid,
            violatedSlot,
            options
        };
    }
    return {
        isValid,
        violatedSlot,
        message: { contentType: 'PlainText', content: messageContent },
        options
    };
}

function intentElicit(greetingResponse) {
    if (greetingResponse === null){
        return buildValidationResult(false, '', ``, '');
    }
    if (greetingResponse.toLowerCase() === 'yes') {
        let btns = [
            {
                txt: 'Yes',
                val: 'Book appointment'
            }, {
                txt: 'No',
                val: 'No'
            }
        ];
        let options = getOptions('Start Appointment Booking?', '', btns);
        return buildValidationResult(true, '', `Booking Appointment`, options);
    }
}

module.exports = (intentRequest) => {
    let greetingResponse = intentRequest.currentIntent.slots.greetings;

    console.log('GREETING?', greetingResponse);

    const source = intentRequest.invocationSource;

    let elicitIntentResult = intentElicit(greetingResponse);

    if (source === 'DialogCodeHook') {
        if (elicitIntentResult.isValid) {
            return Promise.resolve(lexResponses.elicitIntent(
                elicitIntentResult.message,
                elicitIntentResult.options.title,
                elicitIntentResult.options.imageUrl,
                elicitIntentResult.options.buttons
            ));
        }

        return Promise.resolve(lexResponses.delegate(intentRequest.sessionAttributes, intentRequest.currentIntent.slots));
    }

    if (source === 'FulfillmentCodeHook') {
        console.log('fulfilling' + intentRequest.currentIntent.name);
        return Promise.resolve(lexResponses.close(intentRequest.sessionAttributes, 'Fulfilled', null))
    }
};