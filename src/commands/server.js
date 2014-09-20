'use strict';

var util = require('util'),
    path = require('path'),
    zlib = require('zlib'),

    tar = require('tar'),
    vow = require('vow'),
    vowFs = require('vow-fs'),
    express = require('express'),

    pusher = require('../pusher'),
    config = require('../config'),
    logger = require('../logger'),
    commander = require('../commander'),
    constants = require('../constants'),
    utility = require('../util'),

    /**
     * Ping middleware handler
     * @param {Object} req - request object
     * @param {Object} res - response object
     */
    index = function (req, res) {
        var p = path.join(process.cwd(), constants.DIRECTORY.OUTPUT),
            result = [];
        return vowFs.listDir(p).then(function (libs) {
                return vow.all(libs.map(function (item) {
                    return vowFs.isDir(path.join(p, item)).then(function (isDir) {
                        return (isDir && ['.git', 'freeze'].indexOf(item) === -1) ?
                            vowFs.listDir(path.join(p, item)).then(function (versions) {
                                result.push({
                                    lib: item,
                                    versions: versions.filter(function (v) { return v !== '.DS_Store'; })
                                });
                            }) : vow.resolve();
                    });
                }));
            })
            .then(function () {
                res.status(200).json({ fileStructure: result });
            })
            .fail(function (err) {
                res.status(500).send('error ' + err);
            });
    },

    /**
     * Post data middleware handler
     * @param {Object} req - request object
     * @param {Object} res - response object
     */
    retrieveArchive = function (req, res) {
        var p = path.join(process.cwd(), constants.DIRECTORY.OUTPUT);

        p = path.join(p, req.params.lib);
        p = path.join(p, req.params.version);

        vowFs.exists(p).then(function (isExists) {
            var promise = isExists ? utility.removeDir(p) : vow.resolve();

            promise.then(function () {
                vowFs.makeDir(p).then(function () {
                    req
                        .pipe(zlib.Gunzip())
                        .pipe(tar.Extract({ path: p }))
                        .on('error', function (err) {
                            res.status(500).send('error ' + err);
                        })
                        .on('end', function () {
                            logger.debug(util.format('File has been extracted to path', p), module);
                            return moveFromTemp(p)
                                .then(function () {
                                    pusher.chargeForPush();
                                    res.status(200).send('ok');
                                })
                                .fail(function (err) {
                                    res.status(500).send('error ' + err);
                                });
                        });
                });
            });
        });
    };

/**
 * Moves files from /output/{lib}/{version}/temp folder to /output/{lib}/{version} folder
 * @param {String} versionPath - folder of lib version in output directory
 * @returns {*}
 */
function moveFromTemp(versionPath) {
    var tmpDir = path.join(versionPath, constants.DIRECTORY.TEMP);
    return commander.moveFiles(tmpDir, versionPath)
        .then(function () {
            return utility.removeDir(tmpDir);
        });
}

/**
 * Starts express server
 * @param {Object} app - initialized express with default params
 */
function startServer (app) {
    app
        .set('port', config.get('server:port') || 3000)
        .use(function (req, res, next) {
            logger.debug(util.format('retrieve request %s', req.path), module);
            next();
        })
        .get('/', index)
        .post('/publish/:lib/:version', retrieveArchive)
        .listen(app.get('port'), function () {
            logger.info(util.format('Express server listening on port %s', app.get('port')), module);
        });
    pusher.init();
    return app;
}

module.exports = function () {
    return this
        .title('server command')
        .helpful()
        .act(function () {
            logger.info('START server', module);
            return startServer(express());
        });
};