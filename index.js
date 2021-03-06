var TargetView = require('./src/targets/view/api'),
    TargetRemove = require('./src/targets/remove'),
    TargetReplace = require('./src/targets/replace'),
    TargetPublish = require('./src/targets/publish'),
    TargetPrepare = require('./src/targets/prepare'),
    TargetSend = require('./src/targets/send');

/**
 * Publish library data to storage
 * @param {String} version - name of version (branch|tag|pr)
 * @param {Object} options - options object with fields:
 * - {Object} storage configuration:
 *    - {String} namespace - storage key namespace
 *    - {Object} get - object with host and port fields that describes
 *      host and port configuration for read requests
 *    - {Object} post - object with host and port fields that describes
 *      host and port configuration for write|modify requests
 *    - {String} auth header
 * - {Object} logger - logger settings
 * - {Boolean} isDocsOnly - if this flag is set to true then sending examples to storage will be skipped
 * - {Number} maxOpenFiles - number of open files which can be opened at the same time
 * @param {Boolean} isDryRun - dry run flag
 * @returns {*}
 */
exports.publish = function (version, options, isDryRun) {
    options.isDryRun = isDryRun;
    var target = new TargetPublish(version, options);
    return target.execute();
};

/**
 * Prepare library data for sending storage
 * @param {String} version - name of version (branch|tag|pr)
 * @param {Object} options - options object with fields:
 * - {Object} logger - logger settings
 * - {Boolean} sourceUrl - url to original sources on gh
 * @returns {*}
 */
exports.prepare = function (version, options) {
    var target = new TargetPrepare(version, options);
    return target.execute();
};

/**
 * Sends library data to storage
 * @param {String} version - name of version (branch|tag|pr)
 * @param {Object} options - options object with fields:
 * - {Object} storage configuration:
 *    - {String} namespace - storage key namespace
 *    - {Object} get - object with host and port fields that describes
 *      host and port configuration for read requests
 *    - {Object} post - object with host and port fields that describes
 *      host and port configuration for write|modify requests
 *    - {String} auth header
 * - {Object} logger - logger settings
 * - {Boolean} isDocsOnly - if this flag is set to true then sending examples to storage will be skipped
 * - {Number} maxOpenFiles - number of open files which can be opened at the same time
 * @param {Boolean} isDryRun - dry run flag
 * @returns {*}
 */
exports.send = function (version, options, isDryRun) {
    options.isDryRun = isDryRun;
    var target = new TargetSend(version, options);
    return target.execute();
};

/**
 * View registry data
 * @param {String} repo - name of repository (library)
 * @param {String} version - name of version (branch|tag|pr)
 * @param {Object} options - options object with fields:
 * - {Object} storage configuration:
 *    - {String} namespace - storage key namespace
 *    - {Object} get - object with host and port fields that describes
 *      host and port configuration for read requests
 *    - {Object} post - object with host and port fields that describes
 *      host and port configuration for write|modify requests
 * - {Object} logger - logger settings
 * @returns {Promise}
 */
exports.view = function (repo, version, options) {
    var target = new TargetView(repo, version, options);
    return target.execute();
};

/**
 * Replace documentation data in documentation object
 * @param {String} repo - name of repository (library) required
 * @param {String} version - name of version (branch|tag|pr) required
 * @param {Object} options - options object with fields:
 * - {Object} storage configuration:
 *    - {String} namespace - storage key namespace
 *    - {Object} get - object with host and port fields that describes
 *      host and port configuration for read requests
 *    - {Object} post - object with host and port fields that describes
 *      host and port configuration for write|modify requests
 *    - {String} auth header
 * - {Object} logger - logger settings
 * - {String} doc - doc key (readme|changelog|migration|notes) required
 * - {String} lang - language param (en|ru) required
 * - {String} url - url for new document on github (like in browser view) required
 * @returns {Promise}
 */
exports.replace = function (repo, version, options) {
    var target = new TargetReplace(repo, version, options);
    return target.execute();
};

/**
 * Removes version from registry
 * Also removes all example files from storage
 * @param {String} repo - name of repository (library)
 * @param {String} version - name of version (branch|tag|pr)
 * @param {Object} options - options object with fields:
 * - {Object} storage configuration:
 *    - {String} namespace - storage key namespace
 *    - {Object} get - object with host and port fields that describes
 *      host and port configuration for read requests
 *    - {Object} post - object with host and port fields that describes
 *      host and port configuration for write|modify requests
 *    - {String} auth header
 * - {Object} logger - logger settings
 * - {Number} maxOpenFiles - number of open files which can be opened at the same time
 * @param {Boolean} isDryRun - dry run flag
 * @returns {*}
 */
exports.remove = function (repo, version, options, isDryRun) {
    options.isDryRun = isDryRun;
    var target = new TargetRemove(repo, version, options);
    return target.execute();
};
