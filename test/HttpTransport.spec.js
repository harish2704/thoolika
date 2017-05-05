
require('simple-mocha');
var request = require('supertest');
var express = require('express');
var HttpTransport = require('../lib/HttpTransport.js').default;
var assert = require('assert');

var httpTransport = new HttpTransport();
var app = express();
app.set('restifyPrefix', '/');
var statusObj = [ ];
var service = {
  name: 'testservice',
  update: function( id ){
    statusObj.push('updatefn');
    return Promise.resolve( 'updateOut' );
  },

  $middlewares:{
    before:{
      update:[
        function( req, res, next ){
          statusObj.push('beforeUpdate');
          next();
        }
      ]
    },
    after:{
      update: [
        function( req, res, next ){
          statusObj.push('afterUpdate');
          next();
        }
      ]
    }
  }
};

httpTransport.mountService( service, app );

describe( 'HttpTransport class', function( ){
  it( 'should invoke proper middlewares for each service action', function(done){
    request(app)
      .put('/testservice/id')
      .end(function(err, res){
        assert.equal( statusObj[0], 'beforeUpdate' );
        assert.equal( statusObj[1], 'updatefn' );
        assert.equal( statusObj[2], 'afterUpdate' );
        assert.equal( res.text, JSON.stringify({ success:true, data: 'updateOut'}) );
        done();
      });
  });
});
