describe('s.h.i.e.l.d.', function () {
  'use strict';

  var assume = require('assume')
    , shield = require('./');

  it('is exported as function', function () {
    assume(shield).is.a('function');
  });

  [
    {
      host: 'http://google.com',
      yes: ['google.com', '*', 'http://google.com', 'https://google.com'],
      no:  ['yahoo.com', '*.yahoo.com', 'google.com:8080']
    }
  ].forEach(function each(spec) {
    describe(spec.host, function () {
      spec.yes.forEach(function yea(yes) {
        it('should match with '+ yes, function () {
          assume(shield(spec.host, yes)).is.true();
        });
      });

      spec.no.forEach(function nope(no) {
        it('should NOT match with '+ no, function () {
          assume(shield(spec.host, no)).is.false();
        });
      });
    });
  });
});
