# Webpack Mixer

Built on top of [``laravel-mix``][github:laravel-mix].

## Install

```sh
yarn add webpack --dev "SwagDevOps/webpack-mixer#develop"
```

## Configure

Sample ``webpack.mix.js`` file:

```js
const { Mixer } = require('@swagdevops/webpack-mixer')

const mixer = new Mixer()
const paths = mixer.paths

// Configuration ----------------------------------------------------
const copiables = [
  [paths.source.join('images/favicon.png'), paths.public.join('favicon.ico')],
  [paths.source.join('images'), paths.public.join('images')]
]

const cleanables = [
  paths.public.join('css/app.css.map'),
  paths.public.join('js/app.js.map')
]

// Execution --------------------------------------------------------
mixer.configure({
  copiables: copiables,
  cleanables: cleanables,
  webpack: {
    node: {
      fs: 'empty'
    }
  }
}).run()
```

## Run


```sh
node_modules/webpack/bin/webpack.js \
    --progress --hide-modules \
    --config node_modules/@swagdevops/webpack-mixer/setup/webpack.config.js
```

```sh
node_modules/webpack/bin/webpack.js \
    --progress --hide-modules \
    --watch \
    --config node_modules/@swagdevops/webpack-mixer/setup/webpack.config.js
```

[github:laravel-mix]: https://github.com/JeffreyWay/laravel-mix
