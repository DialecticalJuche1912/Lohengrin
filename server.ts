import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import goalRoutes from './routes/goals';

const NAMESPACE = 'Server'; // server is the main function 
const router = express(); 

/* Handle the request */ 

router.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}]`);

    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], STATUS - [${res.statusCode}]`);
    })

    next();
})

/* Parse the request */ 
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/* Routes */ 
router.use('/goals', goalRoutes);

/* Error Handling */
router.use((req, res, next) => {
    const error = new Error('Hello from the server');

    return res.status (404).json({
        message: error.message
    });
});

/* Create the HTTP server */
const myServer = http.createServer(router);
myServer.listen(config.server.port, () => logging.info(NAMESPACE, 
    `Server running on ${config.server.hostname}:${config.server.port}`));


    // have two get and one post request (mand create)
    // dont have update and delete