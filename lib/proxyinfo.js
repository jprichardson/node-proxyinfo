(function() {
  var exports, express, path, proxySpecific;

  path = require('path');

  express = require('express');

  require('string');

  proxySpecific = ['x-forwarded-for', 'forwarded', 'client_ip', 'via', 'proxy_connection', 'xroxy_connection'];

  exports = module.exports;

  exports.createProxyApp = function(params, callback) {
    var app, countryLookup;
    if (params == null) params = {};
    countryLookup = params.countryLookup || (params.countryLookup = false);
    app = express.createServer();
    app.configure(function() {
      app.set('views', path.join(__dirname, '../app/views'));
      app.set('view engine', 'jade');
      app.set('view options', {
        pretty: true
      });
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(app.router);
      app.use(express.static(path.join(__dirname, '../app/public')));
      return app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
      }));
    });
    app.configure("development", function() {
      return app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
      }));
    });
    app.configure("test", function() {
      return app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
      }));
    });
    app.configure("testing", function() {
      return app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
      }));
    });
    app.configure("production", function() {
      return app.use(express.errorHandler());
    });
    app.get('/', function(req, res) {
      var count, country, geoip, header, ip, ipaddress, lookup, proxyHeaders, ps, type, _i, _j, _len, _len2, _ref;
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
      ipaddress = req.connection.remoteAddress;
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
      return res.render('index', {
        headers: req.headers,
        proxyHeaders: proxyHeaders,
        ip: ip
      });
    });
    return callback(app);
  };

}).call(this);
