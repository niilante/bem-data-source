'use strict';

var util = require('util'),
    path = require('path'),

    _ = require('lodash'),
    vow = require('vow'),
    inherit = require('inherit'),
    vowNode = require('vow-node'),
    MailSender = require('bem-site-mail-sender'),

    config = require('../config'),
    Base = require('./base');

module.exports = inherit(Base, {
    run: function () {
        var options = this._target.getOptions()['mailer'] || config.get('mailer'),
            subject = util.format('bem-data-source: success publish library [%s] version [%s]',
                this._target.sourceName, this._target.ref),
            mailer;

        if (!options) {
            this._logger.warn('No e-mail options were set. Sending e-mail will be skipped');
            return vow.resolve();
        }

        mailer = new MailSender(_.pick(options, ['host', 'port']));

        this._logger.debug('Sending e-mail:');
        this._logger.debug('From: %s', options.from);
        this._logger.debug('To: %s', options.to);
        this._logger.debug('Subject: %s', subject);

        var attachment = {
            filename: 'data.json',
            path: path.join(this._target.getContentPath(), 'data.json')
        };
        return vowNode.promisify(mailer.sendWithAttachments)
            .call(mailer, options.from, options.to, subject, '', [attachment])
            .fail(function (error) {
                this._logger.warn('Error occur while sending e-mail');
                this._logger.warn('Error: %s', error.message);
                return vow.resolve(true);
            }, this);
    }
});
