'use strict';

const lexResponses = require('./lexResponses');

const _ = require('lodash');

const booleanLiterals = ['Yes', 'No'];

const practiceAreas = {
    'Dispute Resolution & Litigation': ["Constitutional interpretation", "Labour law", "Judicial review", "Family law", "Environmental and land law"],
    'Real Estate, Conveyancing & Banking': ["Banking and Securitization", "Real estate transactions", "Intellectual property", "Private equity and investment advisory", "Construction"],
    'Corporate & Commercial Law': ["Corporate restructuring", "Public private partnerships", "Capital markets and financial services", "Structured and project finance", "Energy", "Mining", "Oil and gas"],
    'Financial Services': ["Corporate finance", "Project finance", "Transactional advisory"],
    'Telecoms, Media & Tech': ["Data privacy and protection", "Financial technology", "Ownership & Governance", "Consumer protection", "Cyber security", "Intellectual property"],
    'Debt Collection': ["Corporate debts", "Individual debts" ],

};

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

function getButtons(options) {
    let buttons = [];
    _.forEach(options, option => {
        buttons.push({
            text: option,
            value: option
        });
    });
    return buttons;
}

function getOptions(title, imageURL, types) {
    return {
        title,
        imageURL,
        buttons: getButtons(types)
    }
}

function buildNewIntent(newIntent, utterance) {
    return {
        newIntent,
        utterance: { contentType: 'PlainText', content: utterance }
    }
}

function implementIntent(appointmentResponse = null) {
    if (appointmentResponse === null) {
        return  buildNewIntent(false, '')
    }
    return  buildNewIntent(false, '')
}

function validateResponses(inquirerName) {
    if (inquirerName !== null) {
        return buildValidationResult(true, null, null, null);
    }

    /*if (appointmentResponse !== null && appointmentResponse.toLowerCase() === 'no') {
        const options = getOptions('', '', booleanLiterals);
        return buildValidationResult(false, 'do', `Would you like to get in touch with the lawyer?`, options);
    }*/

    return buildValidationResult(true, null, null, null);
}

module.exports = (intentRequest) => {

    let inquirerName = intentRequest.currentIntent.slots.name;

    console.log('INQUIRER', inquirerName);

    const source = intentRequest.invocationSource;

    if (source === 'DialogCodeHook') {

        const slots = intentRequest.currentIntent.slots;

        const validationResult = validateResponses(inquirerName);

        const intentElicit = implementIntent(null);

        if (!validationResult.isValid && !intentElicit.newIntent) {
            slots[`${validationResult.violatedSlot}`] = null;
            return Promise.resolve(
                lexResponses.elicitSlot(
                    intentRequest.sessionAttributes,
                    intentRequest.currentIntent.name,
                    slots,
                    validationResult.violatedSlot,
                    validationResult.message,
                    validationResult.options.title,
                    validationResult.options.imageUrl,
                    validationResult.options.buttons
                )
            );
        }

        if (intentElicit.newIntent) {
            return Promise.resolve(
                lexResponses.elicitIntent(
                    intentElicit.utterance
                )
            );
        }

        return Promise.resolve(lexResponses.delegate(intentRequest.sessionAttributes, intentRequest.currentIntent.slots));
    }

    if (source === 'FulfillmentCodeHook') {
        console.log('do fulfillment')
    }
};