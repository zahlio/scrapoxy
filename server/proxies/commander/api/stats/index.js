'use strict';

const express = require('express');


module.exports = (stats) => {
    const router = express.Router();

    router.get('/', getStats);

    return router;


    ////////////

    function getStats(req, res) {
        const retention = parseRetention(req.query);

        return res.send(
            stats.getHistory(retention)
        );


        ////////////

        function parseRetention(q) {
            if (!q || !q.retention) {
                return;
            }

            const i = parseInt(q.retention);
            if (!i) {
                return;
            }

            return i;
        }
    }
};
