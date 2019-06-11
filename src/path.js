'use strict'

const glob = require('simple-glob')

/* global require, path */

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

  // noinspection JSUnusedGlobalSymbols
  /**
   * Return an array of all file paths that match the given wildcard patterns.
   *
   * @param {String} pattern
   * @returns {Array}
   */
  glob (pattern) {
    return glob(this.join(pattern).toString())
  }

  toString () {
    return this._path
  }

  // noinspection JSUnusedGlobalSymbols
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
