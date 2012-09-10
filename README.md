[![build status](https://secure.travis-ci.org/jprichardson/node-proxyinfo.png)](http://travis-ci.org/jprichardson/node-proxyinfo)

Proxy Info
==========

Proxy Info is a very simple Node.js app that displays information about your proxy connection.


Usage
-----

### Installation

    npm install proxyinfo


### Using as an app

Navigate to the proxyinfo directory and run:

    bin/proxyinfo

This runs on port 80, thus you will need to run this with elevated permissions. I highly suggest that you don't run this as `root` user. Read this [article][1] to learn about how to setup your Node.js app as a service.

### Using as a library

```javascript
var proxyinfo = require('proxyinfo');
proxyinfo.createProxyApp({countryLookup: true}, function(app){
	//your logic here

	app.listen(80);
});
```


License
-------

(MIT License)

Copyright 2012, JP Richardson

See [LICENSE][license] for more details. 

[1]: http://www.exratione.com/2011/07/running-a-nodejs-server-as-a-service-using-forever.php
[license]: https://github.com/jprichardson/node-proxyinfo/blob/master/LICENSE