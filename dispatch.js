'use strict';

const makeGreetings = require('./makeGreetings');
const makeAppointment = require('./makeAppointment');

module.exports = (intentRequest) => {
    console.log(`dispatch userId=${intentRequest.userId}, 
    intentName=${intentRequest.currentIntent.name}`);
    const intentName = intentRequest.currentIntent.name;
    
    if (intentName === 'GetGreetingsToUser') {
        console.log('greeting intent hook called');
        return makeGreetings(intentRequest)
    }

    if (intentName === 'MakeAppointment') {
        console.log('make appointment intent hook called');
        return makeAppointment(intentRequest);
    }

    throw new Error(`Intent with name = ${intentName} isn't supported`);
};