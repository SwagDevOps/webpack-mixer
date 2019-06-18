'use strict'

/* global describe, context, it, before */

const f = require('./factories')
const expect = require('chai').expect

describe('Config', function () {
  context('.paths', function () {
    before(function () {
      this.config = f.config()
    })

    it('should return Object { [key: string]: Path }', function () {
      expect(this.config.paths).to.be.a('object')
      expect(this.config.paths.vendor).to.be.a('object')
      expect(this.config.paths.source).to.be.a('object')
      expect(this.config.paths.public).to.be.a('object')
    })
  })
})

describe('Config', function () {
  context('.cleanables', function () {
    before(function () {
      this.config = f.config()
      let paths = this.config.paths

      this.config.configure({
        copiables: [
          [paths.source.join('images/favicon.png'), paths.public.join('favicon.ico')],
          [paths.source.join('images'), paths.public.join('images')],
          [paths.source.join('images/favicon.png'), paths.public.join('favicon.ico')],
          [paths.source.join('images'), paths.public.join('images')]
        ]
      })
    })

    it('should return 2 (unique) paths', function () {
      expect(this.config.cleanables.length).to.equal(2)
      expect(this.config.cleanables[0].toString()).to.equal('/tmp/public/favicon.ico')
      expect(this.config.cleanables[1].toString()).to.equal('/tmp/public/images')
    })
  })
})
