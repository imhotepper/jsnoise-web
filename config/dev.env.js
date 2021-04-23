'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
 // ROOT_API:'"https://jsnoise.herokuapp.com"'
 ROOT_API:'"http://localhost:5000"',
 BASE_URL:'"/"'
})
