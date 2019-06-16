'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/* global require, __dirname */
var Path_1 = require("./Path");
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
var process = require('process');
var os = require('os');
var WebpackNotifierPlugin = require('webpack-notifier');
var ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
var VersionFile = require('webpack-version-file-plugin');
/**
 * Describe config
 */
var Config = /** @class */ (function () {
    function Config(paths) {
        this.paths = paths;
        this.config = {};
        this.configure(this.defaults);
    }
    Object.defineProperty(Config.prototype, "modulePath", {
        /**
         * Path where module is installed.
         */
        get: function () {
            return new Path_1.Path(__dirname).join('..');
        },
        enumerable: true,
        configurable: true
    });
    Config.prototype.configure = function (config) {
        if (config === void 0) { config = {}; }
        var self = this;
        Object.keys(config).forEach(function (key) {
            self.config[key] = config[key];
        });
        return this;
    };
    Object.defineProperty(Config.prototype, "cleanables", {
        get: function () {
            return this.config.cleanables
                .filter(function (x, i, a) { return a.indexOf(x) === i; })
                .map(function (fp) {
                return new Path_1.Path(fp).toString();
            })
                .sort(function (a, b) {
                return a.localeCompare(b);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "buildables", {
        get: function () {
            return this.config.buildables
                .map(function (files) {
                return [new Path_1.Path(files[0]), new Path_1.Path(files[1])];
            })
                .sort(function (a, b) {
                return a[1].localeCompare(b[1]);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "copiables", {
        get: function () {
            return this.config.copiables
                .map(function (files) {
                return [new Path_1.Path(files[0]), new Path_1.Path(files[1])];
            })
                .sort(function (a, b) {
                return a[1].localeCompare(b[1]);
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "webpackConfig", {
        /**
         * Get webpack config.
         */
        get: function () {
            var config = Object.assign({
                devtool: this.config.devtool,
                resolve: this.config.resolve,
                plugins: []
            }, this.config.webpack);
            config.plugins.push(this.makeExtraWatchWebpackPlugin());
            if (this.config.versionFile) {
                config.plugins.push(this.makeVersionFilePlugin());
            }
            if (this.config.cleanables) {
                config.plugins.push(this.makeCleanWebpackPlugin());
            }
            if (this.config.notify) {
                config.plugins.push(this.makeWebpackNotifierPlugin());
            }
            return config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "moduleRoots", {
        /**
         * Get module root paths.
         *
         * @see https://github.com/tleunen/babel-plugin-module-resolver/issues/81
         */
        get: function () {
            var pkg = require(Path_1.Path.cwd().join('package.json').toString());
            return (pkg.moduleRoots || [])
                .concat(['node_modules'])
                .map(function (fp) {
                return Path_1.Path.cwd().join(fp.toString()).toString() + '/';
            })
                .filter(function (x, i, a) { return a.indexOf(x) === i; })
                .map(function (fp) { return new Path_1.Path(fp); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "defaults", {
        /**
         * @see Mixer.configure()
         */
        get: function () {
            return {
                copiables: [],
                notify: true,
                cleanables: [],
                buildables: [
                    [this.paths.source.join('js/app.js'), this.paths.public.join('js/app.js')],
                    [this.paths.source.join('sass/app.scss'), this.paths.public.join('css/app.css')]
                ],
                /** webpack */
                webpack: {},
                resolve: {
                    modules: this.moduleRoots.map(function (fp) { return fp.toString(); })
                },
                devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
                versionFile: {}
            };
        },
        enumerable: true,
        configurable: true
    });
    Config.prototype.makeCleanWebpackPlugin = function () {
        return new clean_webpack_plugin_1.CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: this.cleanables.map(function (fp) { return fp.toString(); })
        });
    };
    /**
     * @returns {WebpackNotifierPlugin}
     *
     * @see https://github.com/mikaelbr/node-notifier/issues/188
     * @see https://github.com/devanandb/webpack-mix/blob/0f61f71cf302acfcfb9f2e42004404f95eefbef4/src/components/Notifications.js#L3
     */
    Config.prototype.makeWebpackNotifierPlugin = function () {
        var icon = this.modulePath.join('resources/icons/webpack.png').toString();
        return new WebpackNotifierPlugin({
            title: 'Webpack',
            alwaysNotify: true,
            hint: process.platform === 'linux' ? 'int:transient:1' : undefined,
            timeout: (6 * (os.platform() === 'linux' ? 1000 : 1)),
            contentImage: icon,
            icon: (['win32', 'linux'].includes(os.platform()) ? icon : undefined)
        });
    };
    /**
     * @returns {ExtraWatchWebpackPlugin}
     */
    Config.prototype.makeExtraWatchWebpackPlugin = function () {
        return new ExtraWatchWebpackPlugin({
            files: [this.paths.source.join('**/*.vue').toString()]
                .concat(this.moduleRoots.map(function (path) { return path.join('%s/**/*.vue').toString(); }))
        });
    };
    /**
     * @returns {VersionFile}
     */
    Config.prototype.makeVersionFilePlugin = function () {
        return new VersionFile(Object.assign({
            verbose: true,
            packageFile: Path_1.Path.cwd().join('package.json').toString(),
            template: this.modulePath.join('resources/version.ejs').toString(),
            outputFile: this.paths.public.join('version.json').toString()
        }, this.config.versionFile || {}));
    };
    return Config;
}());
exports.Config = Config;
