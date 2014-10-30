describe('s.h.i.e.l.d.', function () {
  'use strict';

  var assume = require('assume')
    , shield = require('./');

  it('is exported as function', function () {
    assume(shield).is.a('function');
  });

  it('returns false no string or array is given', function () {
    assume(shield('www.host.com', {})).is.false();
    assume(shield('www.host.com', new Date)).is.false();
    assume(shield('www.host.com', true)).is.false();
  });

  [
    {
      host: 'http://example.com',
      yes: ['example.com', '*', 'http://example.com', 'https://example.com', 'example.*'],
      no:  ['yahoo.com', '*.yahoo.com', 'example.com:8080', 'example.nl']
    },
    {
      host: 'www.example.com',
      yes: ['*.example.com', [/www\.example\.com/], ['*']],
      no: ['gmail.example.com', 'foo.bar.com', ['foo.bar.com']]
    },
    {
      host: 'foo.bar.example.com',
      yes: ['*.*.example.com', '*.example.com', 'foo.*.example.com', '*.bar.example.com'],
      no: ['hello.*.example.com', '*.*.yahoo.com']
    }
  ].forEach(function each(spec) {
    describe(spec.host, function () {
      if (spec.yes) spec.yes.forEach(function yea(yes) {
        it('should match with '+ yes, function () {
          assume(shield(spec.host, yes)).is.true();
        });
      });

      if (spec.no) spec.no.forEach(function nope(no) {
        it('should NOT match with '+ no, function () {
          assume(shield(spec.host, no)).is.false();
        });
      });
    });
  });
});
