'use strict';

/* global require, __dirname */

import {Config} from './Config'
import {Path} from './Path'

const Mix = require('laravel-mix');

/**
 * Wrapper built on top of Laravel Mix.
 *
 * @see https://laravel-mix.com/
 * @see https://laravel.com/docs/5.8/mix
 */
export class Mixer {
    readonly paths: { [key: string]: Path };

    protected config: Config;

    protected _mix: any;

    constructor(paths: { [key: string]: Path | string } = {}) {
        let self = this;

        this.paths = {
            vendor: this.cwd.join('node_modules'),
            source: this.cwd.join('resources/assets'),
            public: this.cwd.join('public')
        };

        Object.keys(paths).forEach(function (key) {
            self.paths[key] = new Path(paths[key].toString())
        });

        this.config = new Config(this.paths);
    }

    /**
     * Configure with given config.
     *
     * @param config {object}
     * @returns {this}
     */
    configure(config: object = {}) {
        this.config = this.config.configure(config);

        return this
    }

    protected get mix() {
        let webpackConfig = this.config.webpackConfig;
        this._mix = this._mix || (function () {
            let mix = Mix.webpackConfig(webpackConfig);
            if (typeof mix.disableNotifications === 'function') {
                mix.disableNotifications();
            }

            return mix;
        }());

        return this._mix;
    }

    run() {
        this.mixCopiables().mixBuildables().mixSourceMaps();

        return this
    }

    /**
     * @returns {this}
     */
    protected mixSourceMaps(): this {
        this.mix.sourceMaps();

        return this
    }

    /**
     * @returns {this}
     */
    protected mixCopiables(): this {
        let self = this;

        this.config.copiables.forEach(function (copiables) {
            self.mix.copy(copiables[0].toString(), copiables[1].toString(), false)
        });

        return self
    }

    /**
     * @returns {this}
     */
    protected mixBuildables(): this {
        let self = this;

        this.config.buildables.forEach(function (buildables) {
            if (buildables[0].extension === 'js') {
                return self.mix.js(buildables[0].toString(), buildables[1].toString())
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
                })
            }
        });

        return self
    }

    /**
     * Get current working directory.
     */
    get cwd(): Path {
        return Path.cwd()
    }
}
