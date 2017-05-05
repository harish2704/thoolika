
process.env.CONFIG_DIR= __dirname + '/samples/app1/config';

var thoolika = require('../');
var _ = require('lodash');
var app = thoolika.createApplication();
app.set('transports', [ new thoolika.HttpTransport() ]);

require('should');
var assert = require('assert');
require('simple-mocha');

describe('Service Manager', function(){
  it( 'should exists in Application instance', function( ){
    assert.ok( app.serviceManager );
  });

  it( 'should load all the services in the application directory', function(){
    assert.ok( app.serviceManager._services );
    assert.ok( app.serviceManager._services.page );
    assert.ok( app.serviceManager._services.page.get );
  });

  it( 'should mount all services with registered Transports', function(){
    var routerStack =  _.get(app, '_router.stack' );
    var routes = _.map( routerStack, 'route').filter(Boolean);

    var routeWeLooksFor = _.find( routes, function(v) { return v.path=== '/api/page/:id'; });
    assert( routerStack );
    assert( routeWeLooksFor.methods.get );
  });
});
