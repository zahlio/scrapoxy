module.exports = TimeCounter;


////////////

function TimeCounter() {
    this._times = [];
}


TimeCounter.prototype.add = function addFn(time) {
    this._times.push(time);
};


TimeCounter.prototype.getAverageAndClear = function getAverageAndClearFn() {
    if (this._times.length <= 0) {
        return 0.0;
    }

    var sumHR = {
        seconds: 0,
        nanoseconds: 0,
    };

    this._times.forEach(function (time) {
        sumHR.seconds += time[0];
        sumHR.nanoseconds += time[1];
    });

    var sum = sumHR.seconds + (sumHR.nanoseconds / 1000000000.0),
        average = sum / this._times.length;

    this._times = [];

    return average;
};