'use strict'

const glob = require('simple-glob')
const sprintf = require('sprintf-js').sprintf

/* global process, require, path, __dirname */

/**
 * Path represents the name of a file or directory on the filesystem, but not the file itself.
 */
class Path {
  /**
   * @param {string} path
   */
  constructor (path) {
    this._path = path
  }

  /**
   * @returns {string}
   */
  get extension () {
    return path.extname(this.toString()).replace(/^\./, '')
  }

  join (...parts) {
    let fp = path.join(...([this._path].concat(parts)).map(path => path.toString()))

    return new Path(fp)
  }

  format (...args) {
    return new Path(sprintf(...[this.toString()].concat(args)))
  }

  glob () {
    return glob(this.toString())
  }

  toString () {
    return this._path
  }

  /**
   * @param {string} comparable
   * @returns {*|number}
   */
  localeCompare (comparable) {
    return this.toString().localeCompare(comparable)
  }
}

/*
 * Execution --------------------------------------------------------
 */
module.exports = Path
