'use strict';

var express = require('express');


module.exports = createRouter;


////////////

function createRouter(manager) {
    var router = express.Router();

    router.get('/', getStats);

    return router;


    ////////////

    function getStats(req, res) {
        var stats = manager.getStats();

        res.status(200).send(stats);
    }
}