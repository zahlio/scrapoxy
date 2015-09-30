'use strict';

var _ = require('lodash'),
    express = require('express'),
    tools = require('../tools');


module.exports = createRouter;


////////////

function createRouter(stats) {
    var router = express.Router();

    router.get('/', getStats);

    return router;


    ////////////

    function getStats(req, res) {
        var retention = parseRetention(req);

        var items = stats.getHistory(retention);

        return res.status(200).send(items);


        ////////////

        function parseRetention(req) {
            if (!req.query || !req.query.retention) {
                return;
            }

            var i = parseInt(req.query.retention);
            if (!i) {
                return;
            }

            return i;
        }
    }
}