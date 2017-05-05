/* ഓം ബ്രഹ്മാർപ്പണം. */

/*
 * src/PrimusTransport.ts
 * Created: Tue Apr 25 2017 11:52:18 GMT+0530 (IST)
 * Copyright 2017 Harish.K<harish2704@gmail.com>
 */


import {ThoolikaApplication, ThoolikaServiceResponse, Transport, Service } from './Types';
import * as _ from 'lodash';
import * as Promise from 'bluebird';
import * as Primus from 'primus';

const debug = require('debug')('Thoolika::PrimusTransport:debug');


export default class PrimusTransport implements Transport {

  name = 'PrimusTransport';
  primusInstance:any
  primusOptions:any
  services

  constructor( primusOptions={} ){
    this.primusOptions = primusOptions;
  }


  unMountService(service:Service, app:ThoolikaApplication) {

  }

  mountService(service:Service, app:ThoolikaApplication) {
    this.primusInstance.on( 'connection', function( spark ){
      spark.on( 'data', function( data ){
        // TODO: data.actioni should be checked. It can not be an arbitrary value
        const serviceAction = app.serviceManager.get( data.service )[data.action];
        const actionTask = ( ['get', 'update', 'patch', 'remove'].indexOf(data.action) !== -1 ) ?
         serviceAction( data.id, data.data ):
         serviceAction( data.data );
        actionTask.then(function(data){
          spark.write({ data: data, success: true });
        }).catch(function(err){
          spark.write({
            success: false,
            error: err
          });
        });
      });
    });
  }

  setup( app ){
    this.primusInstance = new Primus( app, this.primusOptions );
    return Promise.resolve();
  }

}
