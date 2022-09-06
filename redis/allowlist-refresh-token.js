const redis = require('redis')
const manipula = require('./manipula-lista.js')
const allowlist = redis.createClient({ prefix: 'allowlist-refresh-token: ' })

module.exports = manipula(allowlist)