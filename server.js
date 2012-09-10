proxyinfo = require('./lib/proxyinfo');

proxyinfo.createProxyApp({countryLookup: true}, function(app){
    port = process.env.PORT || 80;
    app.listen(port);
    if (app.address() === null || app.address() === undefined) {
      console.log("Error starting proxyinfo. Did you start as a priviledged user?");
    } else {
      console.log("Listening on %s...", app.address().port);
    }
});


