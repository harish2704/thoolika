/* ഓം ബ്രഹ്മാർപ്പണം. */

/*
 * src/ServiceManager.ts
 * Created: Tue Mar 07 2017 17:42:30 GMT+0530 (IST)
 * Copyright 2017 Harish.K<harish2704@gmail.com>
 */


import { Service, Transport, ThoolikaApplication } from './Types';
import * as Promise from 'bluebird';
import * as fs from 'fs';
import * as path from 'path';

const assert = require('assert');
const warn = require('debug')('Thoolika::ServiceManager:warn');
const debug = require('debug')('Thoolika::ServiceManager:debug');

/**
 *  Manages registration and retrieval of [[ Services ]]
 *  Every plugins and main application can register its own services.
 */
export default class ServiceManager{

  private _services:{
    [ serviceName: string ]: Service
  }

  private _app:ThoolikaApplication

  constructor( app:ThoolikaApplication ){
    this._app = app;
    this.runConfigure = this.runConfigure.bind(this);
    this.runLoad = this.runLoad.bind(this);
    this._services = {};
  }

  /**
   *  Register a service
   */
  register( service:Service ){
    assert( service.name, 'Service should have a valid name ' );
    debug('Registering service: ' + service.name );
    this._services[ service.name ] = service;
  }


  runConfigure(){
    const transports = <Array<Transport>> this._app.get( 'transports' );
    Promise.mapSeries( transports, t => t.setup && t.setup(this._app)  );
  }

  runLoad(){
    const transports = this._app.get( 'transports' );
    if( !( transports && transports.length ) ){
      return warn( 'No transports registered in the App.' );
    }
    transports.forEach( this.enableTransport, this );
  }

  /**
   *  Get a service by its name
   */
  get( serviceName:string ):Service{
    return this._services[serviceName];
  }


  setupService( service:Service ):Promise<any>{
    if( service.setup ){
      return service.setup( this._app );
    }
    return Promise.resolve();
  }

  /**
   *  Expose all the registered services using the given transport.
   */
  enableTransport( transport:Transport ){
    const services = this._services,
          app = this._app;
    let serviceName, service;
    debug( 'Enabling transport: ' + transport.name );
    for( serviceName in services ){
      service = services[serviceName];
      debug( 'Mounting service: ' + serviceName );
      this.setupService( service )
      transport.mountService( service, app );
    }
  }

}
