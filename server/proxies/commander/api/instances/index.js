'use strict';

const express = require('express'),
    winston = require('winston');


module.exports = (manager) => {
    const router = express.Router();

    router.get('/', getInstances);
    router.post('/stop', removeInstance);

    return router;


    ////////////

    function getInstances(req, res) {
        return res.send(manager.stats);
    }

    function removeInstance(req, res) {
        const name = req.body['name'];
        if (!name || name.length <= 0) {
            return res.status(500).send('Name not found');
        }

        try {
            const promise = manager.removeInstance(name);
            if (!promise) {
                return res.status(404).send(`Proxy ${name} not found`);
            }

            promise
                .then(() => res.send({
                    alive: manager.aliveInstances.length,
                }));
        }
        catch (err) {
            winston.error('[Commander] Error: Cannot remove instance %s:', name, err);

            return res.status(500).send(`Error: Cannot remove instance ${name}: ${err.toString()}`);
        }
    }
};
