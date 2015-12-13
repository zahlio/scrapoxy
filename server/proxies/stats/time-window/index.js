'use strict';

const _ = require('lodash');


module.exports = class TimeWindow {
    constructor(retention) {
        this._retention = retention;

        this._items = [];
    }


    add(item) {
        if (!item) {
            return;
        }

        if (!item.ts) {
            item.ts = new Date().getTime();
        }

        this._refresh();

        this._items.push(item);
    }


    getItems(retention) {
        this._refresh();

        if (!retention) {
            return this._items;
        }

        const limit = new Date().getTime() - retention;

        return _.filter(this._items, (item) => item.ts > limit);
    }


    _refresh() {
        const limit = new Date().getTime() - this._retention;

        this._items = _.filter(this._items, (item) => item.ts > limit);
    }
};
