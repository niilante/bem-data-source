var path = require('path'),
    assert = require('assert'),
    should = require('should'),

    vow = require('vow'),
    vowFs = require('vow-fs'),
    utility = require('../src/util.js'),
    ds = require('../index.js'),
    options = {
        debug: true,
        namespace: 'bem-data-source:test'
    };

describe('bem-data-source', function(){
    before(function() {
        process.chdir(path.join(__dirname, './test-data'));
    });

    after(function() {
        return vow.all([
            utility.removeDir(path.join(__dirname, './test-data/temp')),
            vowFs.remove(path.join(__dirname, './test-data/data.json'))
        ]);
    });

    describe('#publish', function(){
        it('should be valid done', function(done) {
            ds.publish('v1.0.0', options, false).then(function() {
                done();
            }).done();
        });
    });

    describe('#view', function(){
        it('should be correct number of libraries', function(done) {
            ds.view(null, null, options)
                .then(function(libraries) {
                    libraries.should.have.length(1);
                    done();
                }).done();
        });

        it('should be correct set of libraries', function(done) {
            ds.view(null, null, options)
                .then(function(libraries) {
                    (libraries.indexOf('test-library') > -1).should.be.true;
                    done();
                }).done();
        });

        it('should be correct number of versions', function(done) {
            ds.view('test-library', null, options)
                .then(function(versions) {
                    versions.should.have.length(1);
                    done();
                }).done();
        });

        it('should be correct set of versions', function(done) {
            ds.view('test-library', null, options)
                .then(function(versions) {
                    (versions.indexOf('v1.0.0') > -1).should.be.true;
                    done();
                }).done();
        });
    });
});
