'use strict';

var express = require('express');


module.exports = createRouter;


////////////

function createRouter(manager) {
    var router = express.Router();

    router.post('/stop', stopInstance);

    return router;


    ////////////

    function stopInstance(req, res) {
        var name = req.body['name'];

        var promise = manager.stopInstance(name);
        if (!promise) {
            return res.status(404).send('Proxy ' + name + ' not found');
        }

        promise
            .then(function() {
                res.sendStatus(204);
            })
            .catch(function(err) {
                res.status(500).send(err);
            });
    }
}