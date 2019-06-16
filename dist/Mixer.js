'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/* global require, __dirname */
var Config_1 = require("./Config");
var Path_1 = require("./Path");
var Mix = require('laravel-mix');
/**
 * Wrapper built on top of Laravel Mix.
 *
 * @see https://laravel-mix.com/
 * @see https://laravel.com/docs/5.8/mix
 */
var Mixer = /** @class */ (function () {
    function Mixer(paths) {
        if (paths === void 0) { paths = {}; }
        var self = this;
        this.paths = {
            vendor: this.cwd.join('node_modules'),
            source: this.cwd.join('resources/assets'),
            public: this.cwd.join('public')
        };
        Object.keys(paths).forEach(function (key) {
            self.paths[key] = new Path_1.Path(paths[key].toString());
        });
        this.config = new Config_1.Config(this.paths);
    }
    /**
     * Configure with given config.
     *
     * @param config {object}
     * @returns {this}
     */
    Mixer.prototype.configure = function (config) {
        if (config === void 0) { config = {}; }
        this.config = this.config.configure(config);
        return this;
    };
    Object.defineProperty(Mixer.prototype, "mix", {
        get: function () {
            var webpackConfig = this.config.webpackConfig;
            this._mix = this._mix || (function () {
                var mix = Mix.webpackConfig(webpackConfig);
                if (typeof mix.disableNotifications === 'function') {
                    mix.disableNotifications();
                }
                return mix;
            }());
            return this._mix;
        },
        enumerable: true,
        configurable: true
    });
    Mixer.prototype.run = function () {
        this.mixCopiables().mixBuildables().mixSourceMaps();
        return this;
    };
    /**
     * @returns {this}
     */
    Mixer.prototype.mixSourceMaps = function () {
        this.mix.sourceMaps();
        return this;
    };
    /**
     * @returns {this}
     */
    Mixer.prototype.mixCopiables = function () {
        var self = this;
        this.config.copiables.forEach(function (copiables) {
            self.mix.copy(copiables[0].toString(), copiables[1].toString(), false);
        });
        return self;
    };
    /**
     * @returns {this}
     */
    Mixer.prototype.mixBuildables = function () {
        var self = this;
        this.config.buildables.forEach(function (buildables) {
            if (buildables[0].extension === 'js') {
                return self.mix.js(buildables[0].toString(), buildables[1].toString());
            }
            /**
             * @see https://github.com/tailwindcss/tailwindcss/issues/48#issuecomment-341423237
             */
            if (buildables[0].extension === 'scss') {
                return self.mix.sass(buildables[0].toString(), buildables[1].toString(), {
                    sourceComments: !self.mix.config.production,
                    includePaths: self.config.moduleRoots
                }).options({
                    processCssUrls: false
                });
            }
        });
        return self;
    };
    Object.defineProperty(Mixer.prototype, "cwd", {
        /**
         * Get current working directory.
         */
        get: function () {
            return Path_1.Path.cwd();
        },
        enumerable: true,
        configurable: true
    });
    return Mixer;
}());
exports.Mixer = Mixer;
