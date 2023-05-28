import { Request, Response, NextFunction } from 'express';
import logging from '../config/logging';
import { Connect, Query } from '../config/mysql';

const NAMESPACE = 'methods'; // all methods are like helper functions, e.g. healthCheck

const healthCheck = (req: Request, res: Response, next: NextFunction ) => {
    logging.info(NAMESPACE, 'Health check');

    return res.status(200).json({
        message: 'Welcome'
    });
};

// GET request fetching all goals 
const getAllGoals = (req: Request, res: Response, next: NextFunction ) => {
    logging.info(NAMESPACE, "Get all goals");

    let query = 'SELECT * FROM Goals';

    Connect().then((connection) => {
        Query(connection, query)
        .then((results) => {
            logging.info(NAMESPACE, "Retrieved goals: ", results);

            return res.status(200).json({
                results
            });
        })
        .catch((error) => {
          logging.error(NAMESPACE, error.message, error);
          return res.status(500).json({
              message: error.message,
              error
          });
        })
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
        return res.status(200).json({
            message: error.message,
            error
        });
    });
};

// POST Request adding a new entry to the database 
const postGoal = (req: Request, res: Response, next: NextFunction ) => {
    logging.info(NAMESPACE, "Post one goal");

    let { id, timeGoal, startTime, endTime, username, description, status, priority, name } = req.body;
    let query = `INSERT INTO Goals (id, timeGoal, startTime, endTime, username, description, status, priority, name) VALUES ("${id}", "${timeGoal}", "${startTime}", "${endTime}", "${username}", "${description}", "${status}", "${priority}", "${name}")`;

    Connect().then((connection) => {
        Query(connection, query)
        .then((result) => {
            logging.info(NAMESPACE, "New goal added: ", result);

            return res.status(200).json({
                result
            });
        })
        .catch((error) => {
          logging.error(NAMESPACE, error.message, error);
          return res.status(500).json({
              message: error.message,
              error
          });
        })
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
        return res.status(200).json({
            message: error.message,
            error
        });
    });
};

// GET Request getting all goals by a specific user 
const getUserGoal = (req: Request, res: Response, next: NextFunction ) => {
    logging.info(NAMESPACE, "GET all goals by one user");

    const uname = req.params.username;
    let query = `SELECT * FROM Goals WHERE username="${uname}"`;

    Connect().then((connection) => {
        Query(connection, query)
        .then((result) => {
            logging.info(NAMESPACE, "Got all goals by user: ", result);

            return res.status(200).json({
                result
            });
        })
        .catch((error) => {
          logging.error(NAMESPACE, error.message, error);
          return res.status(500).json({
              message: error.message,
              error
          });
        })
    })
    .catch((error) => {
        logging.error(NAMESPACE, error.message, error);
        return res.status(200).json({
            message: error.message,
            error
        });
    });
};

export default {
    healthCheck,
    getAllGoals,
    getUserGoal,
    postGoal,
};