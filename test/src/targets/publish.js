var should = require('should'),
    Target = require('../../../src/targets/publish');

describe('targets publish', function () {
    it('should be initialized', function () {
        new Target('v1.0.0', {});
    });

    describe('after initialization', function () {
        var t,
            ref = 'v1.0.0';

        before(function () {
            t = new Target(ref, {});
        });

        it('should have options', function () {
            t._options.should.be.ok;
            Object.keys(t._options).should.have.length(0);
        });

        it('should have tasks', function () {
            t._tasks.should.be.ok;
            t._tasks.should.be.instanceOf(Array);
        });

        it('should have valid number of tasks', function () {
            t._tasks.should.have.length(10);
        });

        it ('should return valid content path', function () {
            t.getContentPath().should.equal(process.cwd());
        });

        it ('should return valid temp path', function () {
            t.getTempPath().should.equal(process.cwd() + '/' + 'temp');
        });
    });
});
