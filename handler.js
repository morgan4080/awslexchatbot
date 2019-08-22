'use strict';

const server = require('./server');
const http = require('serverless-http');
const binaryMimeTypes = require('./binaryMimeTypes');
const dispatch = require('./dispatch');

module.exports.expresss = http(server, {
    binary: binaryMimeTypes
});

module.exports.intents = (event, context, callback) => {
    try {
        console.log(`event.bot.name=${event.bot.name}`);
        dispatch(event).then(response => {
            callback(null, response);
        });
    } catch (err) {
        callback(err);
    }
};