proxyinfo = require('../lib/proxyinfo')
Browser = require('zombie')
testutil = require('testutil')

BASE_PORT = 35612

describe 'proxyinfo', ->
  it 'should respond with client headers', (done) ->
    proxyinfo.createProxyApp countryLookup: false, (app) ->
      url = "http://localhost:#{BASE_PORT}"
      app.listen(BASE_PORT)
      Browser.visit url, (err, browser) ->
        T browser.text('#user-agent').length > 0
        T browser.text('#ipaddress').length > 0
        T browser.text('#type').length > 0
        #console.log browser.text('#type')
        #T browser.text('#type') is 'elite' #since we are not actually connected to a proxy
        done()

