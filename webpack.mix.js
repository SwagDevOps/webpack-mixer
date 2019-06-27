'use strict'

/* global require */
const { Mixer } = require('./dist')

const mixer = new Mixer()
const paths = mixer.paths

// Configuration ----------------------------------------------------

const copiables = []

/** @var {Path[]|string[]} */
const cleanables = []
  .concat(paths.public.join('css').glob('*.map'))
  .concat(paths.public.join('js').glob('*.map'))

// Execution --------------------------------------------------------

mixer.configure({
  copiables,
  cleanables,
  webpack: {
    node: {
      fs: 'empty'
    }
  }
}).run()
