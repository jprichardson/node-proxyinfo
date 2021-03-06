
path = require('path')
http = require('http')
jade = require('jade')
S = require('string')

proxySpecific = ['forwarded-for', 'forwarded-port', 'forwarded-proto','forwarded', 'client_ip', 'via', 'proxy_connection', 'xroxy_connection']

exports = module.exports

template = '''
!!! 5
html
  head
    title Proxy Info
  body
    style
      td.key {text-align: right}
      td.val {padding-left: 10px}

    p 
      h3 All Headers: 
      table
        - for (var key in headers)
          tr
            td.key <strong>#{key}</strong>
            td(id="#{key}").val= headers[key]

    p
      h3 Proxy Specific Headers:
      table
        - for (var key in proxyHeaders)
          tr
            td.key <strong style="color: red;">#{key}</strong>
            td.val= proxyHeaders[key]

    p
      h3 Proxy Info:
      table
        tr
          td.key Origin IP Address
          td(id="ipaddress").val= ip.address
        tr
          td.key Country
          td(id="country").val= ip.country
        tr
          td.key Type
          td(id="type").val= ip.type
'''

fn = jade.compile(template, pretty: true)


exports.createProxyApp = (params = {}, callback) ->
  countryLookup = params.countryLookup or= false

  app = http.createServer (req, res) -> 
    proxyHeaders = {}
    type = 'anonymous'
    count = 0

    for header,val of req.headers
      for ps in proxySpecific
        if S(header.trim().toLowerCase()).endsWith(ps)
          proxyHeaders[header] = req.headers[header]
          count += 1
          if ps is 'forwarded-for'
            type = 'transparent'

    if count is 0
      type = 'elite'

    country = ''
    ipaddress = req.connection.remoteAddress + ':' + req.connection.remotePort

    if countryLookup?
      #geoip = require('geoip-lite')
      #lookup = geoip.lookup(req.connection.remoteAddress)
      if lookup?
        country = lookup.country

    ip = {address: ipaddress, country: country, type: type}
    data = headers: req.headers, proxyHeaders: proxyHeaders, ip: ip
    #res.render 'index', data
    html = fn(data)
    res.writeHead 200, 'Content-Type': 'text/html'
    res.end(html)

  callback(app)

