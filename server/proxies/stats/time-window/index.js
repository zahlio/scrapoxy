var _ = require('lodash');


module.exports = TimeWindow;


////////////

function TimeWindow(retention) {
    this._retention = retention;

    this._items = [];
}


TimeWindow.prototype.add = function addFn(item) {
    if (!item) {
        return;
    }

    if (!item.ts) {
        item.ts = new Date().getTime();
    }

    this._refresh();

    this._items.push(item);
};


TimeWindow.prototype.getItems = function getItemsFn(retention) {
    this._refresh();

    if (!retention) {
        return this._items;
    }

    var limit = new Date().getTime() - retention;

    return _.filter(this._items, function (item) {
        return item.ts > limit;
    });
};


TimeWindow.prototype._refresh = function refreshFn() {
    var limit = new Date().getTime() - this._retention;

    this._items = _.filter(this._items, function (item) {
        return item.ts > limit;
    });
};