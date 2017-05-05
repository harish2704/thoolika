var sampleAppDir = __dirname + '/samples/app1/config';
process.env.CONFIG_DIR= sampleAppDir;
var path = require('path');
var thoolika = require('../');
var _ = require('lodash');
var app = thoolika.createApplication();
app.set('transports', [ new thoolika.HttpTransport() ]);

require('should');
var assert = require('assert');
require('simple-mocha');


describe('Plugin manager', function(){

  it( 'should exists in Application instance', function(){
    assert( app.pluginManager );
    assert( app.pluginManager.plugins instanceof Object );
  });

  it( 'should initialize properly', function(){
    assert.equal( app.pluginManager.pluginDir, path.resolve( sampleAppDir + '/../plugins') );
  });

  it('should locate all the plugins in the plugin directory', function(){
    assert( Object.keys( app.pluginManager.plugins ).length === 1 );
    assert( app.pluginManager.plugins['plugin-1'] );
  });

  it( 'should load all the services provided by a plugin', function(){

    var routerStack =  _.get(app, '_router.stack' );
    var routes = _.map( routerStack, 'route').filter(Boolean);

    var routeWeLooksFor = _.find( routes, function(v) { return v.path=== '/api/servicePa'; });
    assert( routerStack );
    assert( routeWeLooksFor );
    assert( routeWeLooksFor.methods.post );
  });

  it('should register plugin\'s view directory', function(){
    var pluginsViewDir = path.resolve( sampleAppDir + '/../plugins/test-plugin/views');
    assert( app.viewsManager.viewDirs instanceof Array );
    assert( app.viewsManager.viewDirs.indexOf( pluginsViewDir ) !== -1 );
  });

});
