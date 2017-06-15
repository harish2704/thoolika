/* ഓം ബ്രഹ്മാർപ്പണം. */

/*
 * src/index.ts
 * Created: Wed Mar 08 2017 13:27:31 GMT+0530 (IST)
 * Copyright 2017 Harish.K<harish2704@gmail.com>
 */


import express  from "express";

import PluginManager from './PluginManager';
import EntityManager from './EntityManager';
import ViewsManager from './ViewsManager';
import ServiceManager from './ServiceManager';
import { Service, Transport, ThoolikaApplication, ApplicationOptions, ThoolikaModule, Entity, Form  } from './Types';
import EntityService from './EntityService';
import * as Promise from 'bluebird';


const path = require('path');
const config = require('tconfig');
const warn = require('debug')('Thoolika::Main:warn');
const debug = require('debug')('Thoolika::Main:debug');


function applyConfig( app ): ThoolikaApplication{
  let key;
  for( key in config ){
    app.set( key, config[key] );
  }
  return app;
}

function registerModule( thoolikaModule:ThoolikaModule ):Promise<any>{
  if( thoolikaModule.entities && thoolikaModule.entities.length )
    thoolikaModule.entities.forEach( this.entityManager.register, this.entityManager );
  if( thoolikaModule.services && thoolikaModule.services.length )
    thoolikaModule.services.forEach( this.serviceManager.register, this.serviceManager );
  if( thoolikaModule.setup ){
    debug('Setup module' )
    return thoolikaModule.setup( this );
  }
  return Promise.resolve();
}


function setExtra( app, components ){
  let componentName;
  components.registerModule = registerModule.bind(app);
  for( componentName in components ){
    app.set( componentName, components[componentName] );
    app[componentName] = components[componentName];
  }

}

/**
 * Create the main application
 */
export function createApplication( options:ApplicationOptions = {} ): ThoolikaApplication {
  const app = applyConfig( express() );

  if( options.transports ){
    app.set('transports', options.transports );
  }
  if( options.plugins ){
    app.set('plugins', options.plugins );
  }

  const pluginManager = new PluginManager( app )
  const entityManager = new EntityManager();
  const viewsManager = new ViewsManager( app );
  const serviceManager = new ServiceManager( app );

  setExtra( app, { pluginManager, entityManager, viewsManager, serviceManager })

  Promise.mapSeries([
    pluginManager.runConfigure,
    serviceManager.runConfigure,
    viewsManager.runConfigure,

    pluginManager.runLoad,
    serviceManager.runLoad,
    viewsManager.runLoad,
  ],
  function( fn:Function ){ return fn(app); })

  serviceManager.register( EntityService );
  return app;
}



export type PluginManager = PluginManager;
export type Form = Form;
export type EntityManager = EntityManager;
export type Entity = Entity;
export type ViewsManager =  ViewsManager;
export type Transport = Transport;
export type Service = Service;
export type ThoolikaApplication = ThoolikaApplication;
export type ApplicationOptions = ApplicationOptions;
export { default as HttpTransport } from './HttpTransport';
export { default as PrimusTransport } from './PrimusTransport';

