'use strict';

const cors = require('cors');
const express = require('express');
const CSRF = require('csurf');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const AWS = require('aws-sdk');
const lexRuntime = new AWS.LexRuntime();

const server = express();

let api = createApiRouter();

server.use(cors());

server.use(express.urlencoded());
server.use(express.json());

// create application/x-www-form-urlencoded parser
// let urlencodedParser = bodyParser.urlencoded({ extended: false });

const sessionOptions = {
    table: process.env.SESSIONS_TABLE,
    AWSConfigJSON: {
        region: 'us-east-1'
    },
    client: new AWS.DynamoDB({})
};

const SessionStore = require('connect-dynamodb')({session: session});

server.use(cookieParser());

server.use(session({
    store: new SessionStore(sessionOptions),
    secret: '@alexa',
    resave: false,
    cookie: {
        secure: true,
        maxAge: 900000
    },
    saveUninitialized: false
}));

server.use('/reply', api);
const csrfProtection = CSRF({ cookie: true });

server.use(csrfProtection);

// endpoints

server.get('/', (req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.status(200).json({
        security: req.csrfToken()
    })
});


function createApiRouter () {
    let router = new express.Router();

    router.post('*', (req, res, next) => {
        res.set('Access-Control-Allow-Origin', 'https://kijanii.co.ke');
        res.set('Access-Control-Allow-Credentials', true);
        console.log(req.body);
        let text = req.body.message;
        let userIdentifier = req.body.uid;

        if (typeof text === "string") {
            let pars = {
                botAlias: '$LATEST', /* required, has to be '$LATEST' */
                botName: 'ScheduleLawAppointments', /* required, the name of you bot */
                userId: userIdentifier, /* required, arbitrary identifier */
                inputText: text,
                requestAttributes: {

                },
                sessionAttributes: {

                }
            };

            lexRuntime.postText(pars).promise()
                .then(data => {
                    console.log(data);
                    res.status(200).json({
                        message: data.message
                    })
                }).catch(err =>
                console.log(err)
            );
        }
    });

    return router
}

module.exports = server;