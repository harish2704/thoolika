/* ഓം ബ്രഹ്മാർപ്പണം. */

/*
 * src/ViewsManager.ts
 * Created: Wed Mar 08 2017 13:29:03 GMT+0530 (IST)
 * Copyright 2017 Harish.K<harish2704@gmail.com>
 */


import { ThoolikaApplication } from './Types';
import { Environment } from 'nunjucks';
import { resolve, join } from 'path';

const config = require('tconfig');
const nunjucks = require('nunjucks');
const nunjucksWidgets = require('nunjucks-widgets');
const NunjucksFilters = require('./NunjucksFilters');
const nunjucksSyntax = {
  blockStart: '{%',
  blockEnd: '%}',
  variableStart: '{{{',
  variableEnd: '}}}',
  commentStart: '{#',
  commentEnd: '#}'
};



export default class ViewsManager{

  nunjucksEnv:Environment;
  viewDirs:Array<string>;
  _app:ThoolikaApplication;

  constructor( app: ThoolikaApplication){
    this.viewDirs = [];
    this._app = app;
    this.runLoad = this.runLoad.bind(this);
    this.runConfigure = this.runConfigure.bind(this);
  }

  registerViewDir( viewPath:string ){
    this.viewDirs.push( resolve( viewPath ) );
  }

  runConfigure(){

  }

  runLoad(){

    let filterName;
    const nunjucksEnv = nunjucks.configure( this.viewDirs, {
      watch: true,
      autoescape: false,
      express: this._app,
      tags: nunjucksSyntax
    });

    this.nunjucksEnv = nunjucksEnv;

    for( filterName in NunjucksFilters ){
      nunjucksEnv.addFilter( filterName, NunjucksFilters[ filterName] );
    }

    nunjucksEnv.addGlobal( 'cookieName', config.auth.cookie.name );
    nunjucksEnv.addGlobal( 'siteRoot', config.siteRoot );
    nunjucksEnv.addGlobal( 'staticRoot', config.staticRoot );
    nunjucksEnv.addGlobal( 'siteName', config.siteName );

    this._app.set('view engine', 'njk');

    nunjucksWidgets(
      nunjucksEnv,
      join( config.appRoot, 'views', 'widgets' )
    );

  }
}
