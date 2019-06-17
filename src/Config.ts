'use strict';

/* global require, __dirname */

import {Path} from './Path';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';

const process = require('process');
const os = require('os');
const WebpackNotifierPlugin = require('webpack-notifier');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const VersionFile = require('webpack-version-file-plugin');

/**
 * Describe config
 */
export class Config {
    readonly paths: { [key: string]: Path };

    protected config: { [key: string]: any };

    constructor(paths: { [key: string]: Path }) {
        this.paths = paths;
        this.config = {};

        this.configure(this.defaults)
    }

    /**
     * Path where module is installed.
     */
    protected get modulePath(): Path {
        return new Path(__dirname).join('..')
    }

    configure(config: { [key: string]: any } = {}): this {
        let self = this;

        Object.keys(config).forEach(function (key: string) {
            self.config[key] = config[key]
        });

        return this;
    }

    get cleanables(): Path[] {
        let self = this;

        return this.config.cleanables
            .map(function (fp: string | Path): string {
                return new Path(fp).toString();
            })
            .concat((function () {
                return self.config.cleanCopiables
                    ? self.copiables.map(x => x[1])
                    : [];
            }()))
            .filter((x: string, i: number, a: string) => a.indexOf(x) === i)
            .sort(function (a: Path, b: Path) {
                return a.localeCompare(b)
            });
    }

    get buildables(): Path[][] {
        return this.config.buildables
            .map(function (files: string[] | Path[]): Path[] {
                return [new Path(files[0]), new Path(files[1])];
            })
            .sort(function (a: Path[], b: Path[]) {
                return a[1].localeCompare(b[1])
            })
    }

    get copiables(): Path[][] {
        return this.config.copiables
            .map(function (files: string[] | Path[]): Path[] {
                return [new Path(files[0]), new Path(files[1])];
            })
            .sort(function (a: Path[], b: Path[]) {
                return a[1].localeCompare(b[1])
            })
    }

    /**
     * Get webpack config.
     */
    get webpackConfig(): object {
        let config = Object.assign({
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

        return config
    }

    /**
     * Get module root paths.
     *
     * @see https://github.com/tleunen/babel-plugin-module-resolver/issues/81
     */
    get moduleRoots(): Path[] {
        let pkg: { [key: string]: any } = require(Path.cwd().join('package.json').toString());

        return (pkg.moduleRoots || [])
            .concat(['node_modules'])
            .map(function (fp: string | Path): string {
                return Path.cwd().join(fp.toString()).toString() + '/';
            })
            .filter((x: string, i: number, a: string): boolean => a.indexOf(x) === i)
            .map((fp: string): Path => new Path(fp))
    }

    /**
     * @see Mixer.configure()
     */
    protected get defaults(): object {
        return {
            copiables: [],
            notify: true,
            cleanables: [],
            cleanCopiables: true,
            buildables: [
                [this.paths.source.join('js/app.js'), this.paths.public.join('js/app.js')],
                [this.paths.source.join('sass/app.scss'), this.paths.public.join('css/app.css')]
            ],
            /** webpack */
            webpack: {},
            resolve: {
                modules: this.moduleRoots.map(fp => fp.toString())
            },
            devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
            versionFile: {}
        }
    }

    protected makeCleanWebpackPlugin(): CleanWebpackPlugin {
        return new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: this.cleanables.map(fp => fp.toString())
        })
    }

    /**
     * @returns {WebpackNotifierPlugin}
     *
     * @see https://github.com/mikaelbr/node-notifier/issues/188
     * @see https://github.com/devanandb/webpack-mix/blob/0f61f71cf302acfcfb9f2e42004404f95eefbef4/src/components/Notifications.js#L3
     */
    protected makeWebpackNotifierPlugin() {
        let icon = this.modulePath.join('resources/icons/webpack.png').toString();

        return new WebpackNotifierPlugin({
            title: 'Webpack',
            alwaysNotify: true,
            hint: process.platform === 'linux' ? 'int:transient:1' : undefined,
            timeout: (6 * (os.platform() === 'linux' ? 1000 : 1)), // linux (notify-send) uses milliseconds
            contentImage: icon,
            icon: (['win32', 'linux'].includes(os.platform()) ? icon : undefined)
        })
    }

    /**
     * @returns {ExtraWatchWebpackPlugin}
     */
    protected makeExtraWatchWebpackPlugin() {
        return new ExtraWatchWebpackPlugin({
            files: [this.paths.source.join('**/*.vue').toString()]
                .concat(this.moduleRoots.map(path => path.join('%s/**/*.vue').toString()))
        })
    }

    /**
     * @returns {VersionFile}
     */
    protected makeVersionFilePlugin() {
        return new VersionFile(Object.assign({
            verbose: true,
            packageFile: Path.cwd().join('package.json').toString(),
            template: this.modulePath.join('resources/version.ejs').toString(),
            outputFile: this.paths.public.join('version.json').toString()
        }, this.config.versionFile || {}))
    }
}
