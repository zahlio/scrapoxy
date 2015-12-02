'use strict';

module.exports = class TimeCounter {
    constructor() {
        this._times = [];
    }


    add(time) {
        this._times.push(time);
    }


    getAverageAndClear() {
        if (this._times.length <= 0) {
            return 0.0;
        }

        const sumHR = {
            seconds: 0,
            nanoseconds: 0,
        };

        this._times.forEach((time) => {
            sumHR.seconds += time[0];
            sumHR.nanoseconds += time[1];
        });

        const sum = sumHR.seconds + sumHR.nanoseconds / 1000000000.0,
            average = sum / this._times.length;

        this._times = [];

        return average;
    }
};
