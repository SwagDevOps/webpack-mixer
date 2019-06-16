'use strict'

/* global describe, context, it */

const { Path } = require('../dist')
const expect = require('chai').expect
const process = require('process')

describe('Path', function () {
  context('.cwd()', function () {
    it('should return Object', function () {
      expect(Path.cwd()).to.be.a('object')
    })
  })

  context('.cwd().toString()', function () {
    it('should return a string', function () {
      expect(Path.cwd().toString()).to.be.a('string')
    })

    it('should return cwd as seen by process', function () {
      expect(Path.cwd().toString()).to.equal(process.cwd())
    })
  })
})
