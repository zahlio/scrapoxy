'use strict';

module.exports = sigstop;


var sig_cb;


////////////

function sigstop(callback) {
    if (!sig_cb) {
        _registerClosingSignals();
    }

    sig_cb = callback;


    ////////////

    function _registerClosingSignals() {
        var signals = [
            'SIGABRT',
            'SIGALRM',
            'SIGBUS',
            'SIGFPE',
            'SIGHUP',
            'SIGILL',
            'SIGINT',
            'SIGQUIT',
            'SIGSEGV',
            'SIGTERM',
            'SIGUSR1',
            'SIGUSR2',
            'SIGPROF',
            'SIGSYS',
            'SIGTRAP',
            'SIGVTALRM',
            'SIGXFSZ'
        ];

        signals.forEach(function(signal) {
            process.on(signal, function() {
                if (sig_cb) {
                    sig_cb(signal);
                }
            });
        });
    }
}
