'use strict'

const { Config } = require('../dist')
const { Path } = require('../dist')

/**
 * Build paths located in `basedir`.
 *
 * @param {string} basedir
 * @returns {{public: Path, vendor: Path, source: Path}}
 */
const paths = function (basedir = '/tmp') {
  let path = new Path(basedir)

  return {
    vendor: path.join('node_modules'),
    source: path.join('resources/assets'),
    public: path.join('public')
  }
}

/**
 * Build a minimal Config (starting from `basedir`).
 *
 * @param {string} basedir
 * @return {Config}
 */
const config = function (basedir = '/tmp') {
  return new Config(paths(basedir))
}

module.exports = { config, paths }
