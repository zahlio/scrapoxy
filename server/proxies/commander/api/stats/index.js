'use strict';

const Router = require('koa-router');


module.exports = (stats) => {
    const router = new Router();

    router.get('/', getStats);

    return router.routes();


    ////////////

    function *getStats() {
        const retention = parseRetention(this.request.query);

        this.status = 200;
        this.body = stats.getHistory(retention);


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
