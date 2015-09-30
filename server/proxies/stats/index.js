'use strict';


var _ = require('lodash'),
    Promise = require('bluebird'),
    EventEmitter = require('events').EventEmitter,
    TimeCounter = require('./time-counter'),
    TimeWindow = require('./time-window'),
    util = require('util'),
    winston = require('winston');


module.exports = StatsManager;


/////////

function StatsManager(config) {
    var self = this;

    EventEmitter.call(self);

    self._config = config;

    // History stats
    self._history = new TimeWindow(self._config.retention);
    self.on('stats', function (stats) {
        self._history.add(stats);
    });

    // Request count
    self._rqCount = void 0;

    // Buffer
    self._buffer = createEmptyBuffer();


    setInterval(historize, self._config.samplingDelay);


    ////////////

    function createEmptyBuffer() {
        return {
            rq: {
                duration: new TimeCounter(),
                count: 0,
            },
            flow: {
                bytes_sent: 0,
                bytes_received: 0,
            },
        };
    }

    function historize() {
        // Create stats
        var stats = {
            rq: {
                duration: self._buffer.rq.duration.getAverageAndClear(),
                count: self._buffer.rq.count,
            },
            flow: {
                bytes_sent: self._buffer.flow.bytes_sent,
                bytes_received: self._buffer.flow.bytes_received,
            },
            global: {},
        };

        if (self._rqCount) {
            stats.global.rq_before_stop = {
                min: self._rqCount.min,
                max: self._rqCount.max,
                avg: Math.floor(self._rqCount.sum / self._rqCount.count),
            };
        }

        self._buffer = createEmptyBuffer();

        self.emit('stats', stats);
    }
}
util.inherits(StatsManager, EventEmitter);


StatsManager.prototype.requestEnd = function requestEndFn(duration, bytesSent, bytesReceived) {
    this._buffer.rq.duration.add(duration);

    ++this._buffer.rq.count;

    this._buffer.flow.bytes_sent += bytesSent;
    this._buffer.flow.bytes_received += bytesReceived;
};


StatsManager.prototype.addRqCount = function addRqCountFn(count) {
    if (!count) {
        return;
    }

    if (this._rqCount) {
        this._rqCount.min = Math.min(this._rqCount.min, count);
        this._rqCount.max = Math.max(this._rqCount.max, count);
        this._rqCount.sum += count;
        ++this._rqCount.count;
    }
    else {
        this._rqCount = {
            min: count,
            max: count,
            sum: count,
            count: 1,
        };
    }
};


StatsManager.prototype.getHistory = function getHistoryFn(retention) {
    return this._history.getItems(retention);
};
