(function() {
  var exports, express, fn, http, jade, path, proxySpecific, template;

  path = require('path');

  express = require('express');

  http = require('http');

  jade = require('jade');

  require('string');

  proxySpecific = ['x-forwarded-for', 'forwarded', 'client_ip', 'via', 'proxy_connection', 'xroxy_connection'];

  exports = module.exports;

  template = '!!! 5\nhtml\n  head\n    title Proxy Info\n    link(rel=\'stylesheet\', href=\'/stylesheets/style.css\')\n  body\n    style\n      td.key {text-align: right}\n      td.val {padding-left: 10px}\n\n    p \n      h3 All Headers: \n      table\n        - for (var key in headers)\n          tr\n            td.key <strong>#{key}</strong>\n            td(id="#{key}").val= headers[key]\n\n    p\n      h3 Proxy Specific Headers:\n      table\n        - for (var key in proxyHeaders)\n          tr\n            td.key <strong style="color: red;">#{key}</strong>\n            td.val= proxyHeaders[key]\n\n    p\n      h3 Proxy Info:\n      table\n        tr\n          td.key Origin IP Address\n          td(id="ipaddress").val= ip.address\n        tr\n          td.key Country\n          td(id="country").val= ip.country\n        tr\n          td.key Type\n          td(id="type").val= ip.type';

  fn = jade.compile(template, {
    pretty: true
  });

  exports.createProxyApp = function(params, callback) {
    var app, countryLookup;
    if (params == null) params = {};
    countryLookup = params.countryLookup || (params.countryLookup = false);
    app = http.createServer(function(req, res) {
      var count, country, data, geoip, header, html, ip, ipaddress, lookup, proxyHeaders, ps, type, _i, _j, _len, _len2, _ref;
      proxyHeaders = {};
      type = 'anonymous';
      count = 0;
      _ref = req.headers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        header = _ref[_i];
        for (_j = 0, _len2 = proxySpecific.length; _j < _len2; _j++) {
          ps = proxySpecific[_j];
          if (header.toLowerCase().endsWith(ps)) {
            proxyHeaders[header] = req.headers[header];
            count += 1;
            if (ps === 'x-forwarded-for') type = 'transparent';
          }
        }
      }
      if (count === 0) type = 'elite';
      country = '';
      ipaddress = req.connection.remoteAddress + ':' + req.connection.remotePort;
      if (countryLookup != null) {
        geoip = require('geoip-lite');
        lookup = geoip.lookup(ipaddress);
        if (lookup != null) country = lookup.country;
      }
      ip = {
        address: ipaddress,
        country: country,
        type: type
      };
      data = {
        headers: req.headers,
        proxyHeaders: proxyHeaders,
        ip: ip
      };
      html = fn(data);
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      return res.end(html);
    });
    return callback(app);
  };

}).call(this);
