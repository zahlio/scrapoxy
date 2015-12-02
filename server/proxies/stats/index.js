'use strict';

const _ = require('lodash'),
    EventEmitter = require('events').EventEmitter,
    TimeCounter = require('./time-counter'),
    TimeWindow = require('./time-window');


module.exports = class Stats extends EventEmitter {
    constructor(config) {
        super();

        const self = this;

        self._config = config;

        // History stats
        self._history = new TimeWindow(self._config.retention);
        self.on('stats', (stats) => self._history.add(stats));

        // Request count
        self._rqCount = void 0;

        // Counter
        self._counter = {
            stop_order_count: 0,
            rq_count: 0,
            bytes_sent: 0,
            bytes_received: 0,
        };

        // Buffer
        self._buffer = createEmptyBuffer();

        // Sampling
        setInterval(historize, self._config.samplingDelay);


        ////////////

        function historize() {
            // Create stats
            const stats = {
                rq: {
                    duration: self._buffer.rq.duration.getAverageAndClear(),
                    count: self._buffer.rq.count,
                },
                flow: {
                    bytes_sent: self._buffer.flow.bytes_sent,
                    bytes_received: self._buffer.flow.bytes_received,
                },
                global: _.cloneDeep(self._counter),
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
    }


    requestEnd(duration, bytesSent, bytesReceived) {
        this._buffer.rq.duration.add(duration);

        ++this._buffer.rq.count;
        ++this._counter.rq_count;

        this._buffer.flow.bytes_sent += bytesSent;
        this._counter.bytes_sent += bytesSent;

        this._buffer.flow.bytes_received += bytesReceived;
        this._counter.bytes_received += bytesReceived;
    }


    addRqCount(count) {
        ++this._counter.stop_order_count;

        if (!count) {
            // Don't add immediate blacklisting
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
    }


    getHistory(retention) {
        return this._history.getItems(retention);
    }
};
