'use strict';

const expect = require('chai').expect,
    sanitize = require('./index');


/* eslint prefer-arrow-callback: 0 */
describe('request headers transformation', function desc() {
    it('should correct headers', () => {
        const bad_headers = {
            '': 'header0',
            'p3p ': 'header1',
            ' aze': 'header2',
            ' aze-sdf-aze': 'header3',
            ' #aze #12': 'header4',
            'X-Normal-Header': 'header5',
        };

        const good_headers = {
            'p3p': 'header1',
            'aze': 'header2',
            'aze-sdf-aze': 'header3',
            'aze12': 'header4',
            'X-Normal-Header': 'header5',
        };

        const expected = sanitize.headers(bad_headers);
        expect(expected).to.be.deep.equals(good_headers);
    });
});
