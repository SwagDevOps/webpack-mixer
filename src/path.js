'use strict'

/* global require */
const glob = require('simple-glob')
const path = require('path')
const fs = require('fs')
const chdir = require('chdir')

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

  /**
   * @returns {Stats}
   */
  stat () {
    return fs.lstatSync(this.toString())
  }

  /**
   * @returns {boolean}
   */
  exists () {
    return fs.existsSync(this.toString())
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Return an array of all file paths that match the given wildcard patterns.
   *
   * @param {String} pattern
   * @param {boolean} absolute
   * @returns {Path[]}
   */
  glob (pattern, absolute = true) {
    let self = this
    let matches = []
    let directory = this.toString()

    if (this.exists() && this.stat().isDirectory()) {
      chdir(directory, function () {
        matches = glob(pattern)
          .map(function (fp) {
            return absolute ? self.join(fp) : new Path(fp)
          })
      })
    }

    return matches
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
