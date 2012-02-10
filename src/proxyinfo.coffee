
path = require('path')
express = require('express')
require('string')

proxySpecific = ['x-forwarded-for', 'forwarded', 'client_ip', 'via', 'proxy_connection', 'xroxy_connection',]

exports = module.exports

exports.createProxyApp = (params = {}, callback) ->
  countryLookup = params.countryLookup or= false

  app = express.createServer()

  app.configure ->
    app.set('views', path.join(__dirname, '../app/views'))
    app.set('view engine', 'jade')
    app.set('view options', pretty: true)
    #app.register('.coffee', ck.adapters.express)
    app.use(express.bodyParser())
    app.use(express.methodOverride())
    app.use(app.router)
    app.use(express.static(path.join(__dirname, '../app/public')))
    app.use(express.errorHandler(dumpExceptions: true, showStack: true))

  app.configure "development", -> app.use express.errorHandler dumpExceptions: true, showStack: true
  app.configure "test", -> app.use express.errorHandler dumpExceptions: true, showStack: true
  app.configure "testing", -> app.use express.errorHandler dumpExceptions: true, showStack: true

  app.configure "production", -> app.use express.errorHandler()

  app.get '/', (req, res) ->
    proxyHeaders = {}
    type = 'anonymous'
    count = 0

    for header in req.headers
      for ps in proxySpecific
        if header.toLowerCase().endsWith(ps)
          proxyHeaders[header] = req.headers[header]
          count += 1
          if ps is 'x-forwarded-for'
            type = 'transparent'

    if count is 0
      type = 'elite'

    country = ''
    ipaddress = req.connection.remoteAddress

    if countryLookup?
      geoip = require('geoip-lite')
      lookup = geoip.lookup(ipaddress)
      if lookup?
        country = lookup.country

    ip = {address: ipaddress, country: country, type: type} 
    res.render 'index', headers: req.headers, proxyHeaders: proxyHeaders, ip: ip

  callback(app)

