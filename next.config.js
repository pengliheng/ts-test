// next.config.js
const withLess = require('@zeit/next-css')
const withTypescript = require('@zeit/next-typescript')

module.exports = withTypescript(withLess())