'use strict'

/* global process, require, __dirname */

const Mix = require('laravel-mix')
const os = require('os')
const assert = require('assert').strict
const WebpackNotifierPlugin = require('webpack-notifier')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin')
const VersionFile = require('webpack-version-file-plugin')
const Path = require('./path')

/**
 * Wrapper built on top of Laravel Mix.
 *
 * @see https://laravel-mix.com/
 * @see https://laravel.com/docs/5.8/mix
 */
class Mixer {
  /**
   * @param {Object} paths
   */
  constructor (paths = {}) {
    this._paths = {
      vendor: this.cwd().join('node_modules'),
      source: this.cwd().join('resources/assets'),
      public: this.cwd().join('public')
    }

    Object.assign(this._paths, paths)
  }

  /**
   * Configure with given config.
   *
   * @param config {object}
   * @returns {this}
   */
  configure (config = {}) {
    this._config = Object.assign({}, this._defaultConfig)
    Object.assign(this._config, config)

    this.config.cleanables
      .filter((x, i, a) => a.indexOf(x) === i)
      .sort(function (a, b) { return a.localeCompare(b) })

    return this
  }

  /**
   * @returns {object}
   * @private
   *
   * @see Mixer.configure()
   */
  get _defaultConfig () {
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
        modules: this.moduleRoots.map(fp => fp.toString())
      },
      devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : false,
      versionFile: {}
    }
  }

  /**
   * Get config.
   *
   * @returns {Object}
   */
  get config () {
    return Object.assign({}, this._config || this._defaultConfig)
  }

  /**
   * Get paths.
   *
   * @returns {Object}
   */
  get paths () {
    return Object.assign({}, this._paths)
  }

  /**
   * Path where module is stored.
   *
   * @private
   * @returns {Path}
   */
  get _modulePath () {
    return new Path(__dirname)
  }

  /**
   * Get module root paths.
   *
   * @returns {Path[]}
   * @see https://github.com/tleunen/babel-plugin-module-resolver/issues/81
   */
  get moduleRoots () {
    return (require(this.cwd().join('package.json').toString()).moduleRoots || [])
      .concat(['node_modules'])
      .map(fp => this.cwd().join(fp).toString() + '/')
      .filter((x, i, a) => a.indexOf(x) === i)
      .map(fp => new Path(fp))
  }

  /**
   * Get current working directory.
   *
   * @returns {Path}
   */
  cwd () {
    return new Path(process.cwd())
  }

  /**
   * Get webpack config.
   *
   * @returns {Object}
   */
  getWebpackConfig () {
    let config = Object.assign({
      devtool: this.config.devtool,
      resolve: this.config.resolve,
      plugins: []
    }, this.config.webpack)

    config.plugins.push(this._makeExtraWatchWebpackPlugin())

    if (this.config.versionFile) {
      config.plugins.push(this._makeVersionFilePlugin())
    }

    if (this.config.cleanables) {
      config.plugins.push(this._makeCleanWebpackPlugin())
    }

    if (this.config.notify) {
      config.plugins.push(this._makeWebpackNotifierPlugin())
    }

    return config
  }

  run () {
    this._mixCopiables()._mixBuildables()._mixSourceMaps()

    return this
  }

  /**
   * @returns {Mix}
   * @private
   */
  get mix () {
    this._mix = this._mix || Mix.webpackConfig(this.getWebpackConfig()).disableNotifications()

    return this._mix
  }

  /**
   * @returns {this}
   * @private
   */
  _mixSourceMaps () {
    this._mix.sourceMaps()

    return this
  }

  /**
   * @returns {this}
   * @private
   */
  _mixCopiables () {
    let self = this

    this.config.copiables
      .map(function (row) {
        assert.ok(Array.isArray(row))
        assert.ok(row.length === 2)

        return row
      }).forEach(function (copiables) {
        self.mix.copy(copiables[0].toString(), copiables[1].toString(), false)
      })

    return self
  }

  /**
   * @returns {this}
   * @private
   */
  _mixBuildables () {
    let self = this

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
          includePaths: self.moduleRoots
        }).options({
          processCssUrls: false
        })
      }
    })

    return self
  }

  /**
   * @returns {WebpackNotifierPlugin}
   * @private
   *
   * @see https://github.com/mikaelbr/node-notifier/issues/188
   * @see https://github.com/devanandb/webpack-mix/blob/0f61f71cf302acfcfb9f2e42004404f95eefbef4/src/components/Notifications.js#L3
   */
  _makeWebpackNotifierPlugin () {
    let icon = this._modulePath.join('icons/webpack.png').toString()

    return new WebpackNotifierPlugin({
      title: 'Webpack',
      alwaysNotify: true,
      hint: process.platform === 'linux' ? 'int:transient:1' : undefined,
      timeout: 4000, // linux (notify-send) uses milliseconds
      contentImage: icon,
      icon: (os.platform() === 'win32' || os.platform() === 'linux') ? icon : undefined
    })
  }

  /**
   * @returns {CleanWebpackPlugin}
   * @private
   */
  _makeCleanWebpackPlugin () {
    let cleanables = this.config.cleanables.map(fp => fp.toString())

    return new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: cleanables
    })
  }

  /**
   * @returns {ExtraWatchWebpackPlugin}
   * @private
   */
  _makeExtraWatchWebpackPlugin () {
    return new ExtraWatchWebpackPlugin({
      files: [this.paths.source.join('**/*.vue').toString()]
        .concat(this.moduleRoots.map(path => path.join('%s/**/*.vue').toString()))
    })
  }

  /**
   * @returns {VersionFile}
   * @private
   */
  _makeVersionFilePlugin () {
    return new VersionFile(Object.assign({
      verbose: true,
      packageFile: this.cwd().join('package.json').toString(),
      template: this._modulePath.join('resources/version.ejs').toString(),
      outputFile: this.paths.public.join('version.json').toString()
    }, this.config.versionFile || {}))
  }
}

module.exports = Mixer
