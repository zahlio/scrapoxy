'use strict';

module.exports = sigstop;


let sig_cb;


////////////

function sigstop(callback) {
    if (!sig_cb) {
        registerClosingSignals();
    }

    sig_cb = callback;


    ////////////

    function registerClosingSignals() {
        const signals = [
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
            'SIGXFSZ',
        ];

        signals.forEach((signal) => {
            process.on(signal, () => {
                if (sig_cb) {
                    sig_cb(signal);
                }
            });
        });
    }
}
