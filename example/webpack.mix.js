'use strict'

/* global require */
const { Mixer } = require('../dist/index')
const mixer = new Mixer()
const paths = mixer.paths

// Configuration ----------------------------------------------------

const copiables = []

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
