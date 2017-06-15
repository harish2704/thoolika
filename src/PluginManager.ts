/* ഓം ബ്രഹ്മാർപ്പണം. */

/*
 * src/PluginManager.ts
 * Created: Wed Mar 08 2017 13:28:03 GMT+0530 (IST)
 * Copyright 2017 Harish.K<harish2704@gmail.com>
 */


import * as Promise from 'bluebird';
import { resolve, dirname, join as _p } from 'path';
import { readdirSync, existsSync } from 'fs';
import { ThoolikaApplication, Plugin } from './Types';
const warn = require('debug')('Thoolika::PluginManager:warn');
const debug = require('debug')('Thoolika::PluginManager:debug');
const filetypeRegex = /\.module(\.js)?$/;



export default class PluginManager{

  plugins: {
    [name:string]: Plugin
  };

  pluginDir:string;

  _app:ThoolikaApplication;
  _npmPlugins: Array<string>;

  constructor( app:ThoolikaApplication ){
    const appRoot = app.get('appRoot');
    this._app = app;
    this._npmPlugins = app.get('plugins') || [];
    this.plugins ={};
    this.pluginDir = resolve( _p( appRoot, 'plugins' ) );
    this.runLoad = this.runLoad.bind(this);
    this.runConfigure = this.runConfigure.bind(this);
  }


  /**
   *  Read package.json file of give pluginDir
   *  @param pluginDir - full path of the plugin directory
   */
  configurePlugin( pluginDir:string ){
    const info = require( _p( pluginDir, 'package.json' ) );
    const viewDir =  _p( pluginDir, 'views' );
    info.pluginDir =  pluginDir;
    info.main = require( pluginDir );
    debug('configurePlugin: ' + info.pluginDir );
    this.plugins[ info.name ] = info;
    this.addViewDir( viewDir );
  }

  private _readPluginInfo( pluginDirName:string ){
    const pluginDir = _p( this.pluginDir, pluginDirName );
    this.configurePlugin( pluginDir );
  }


  addViewDir( viewDir ){
    if( existsSync( viewDir ) ){
      debug('Registering view directory: ' + viewDir )
      this._app.viewsManager.registerViewDir(  viewDir );
    }
  }

  /**
   *  Read the list of directories available in the `plugins` directory of application directory
   */
  readPluginNames(){
    if( !existsSync( this.pluginDir ) ){
      return;
    }
    readdirSync( this.pluginDir ).forEach( this._readPluginInfo, this );
    this._npmPlugins.forEach( npmModuleName => this.configurePlugin( dirname( require.resolve(npmModuleName + '/package.json') ) ) );
    this.addViewDir( _p( this._app.get('appRoot'), 'views' ) );
  }

  /**
   *  Validate a plugin by checking its peer dependency version numbers etc.
   */
  validatePlugin( name:string ):boolean{
    return true;
  }

  /**
   *  Load a plugin with given name
   *  It will do the following
   *  * Load all the services in the 'services' directory of plugin
   */
  loadPlugin( name:string ):Promise<any>{
    const plugin = this.plugins[name];
    debug('loading plugin: ' + name );
    return this
    .registerModules( _p( plugin.pluginDir, 'modules' ) )
    .then(() => plugin.main.setup && plugin.main.setup(this._app));
  }


  /**
   *  Register all the * *.module.* * files in the given directory.
   */
  registerModules( modulesDir:string ):Promise<any>{
    if( !existsSync(modulesDir) ){
      return Promise.resolve();
    }
    const fileList = readdirSync( modulesDir );
    debug('Registering modules from: ' + modulesDir )
    return Promise.mapSeries(fileList, fname => {
      if( fname.match( filetypeRegex ) ){
        const modDir = _p( modulesDir, fname );
        const mod = require( modDir );
        debug('Registering module: ' + modDir );
        this._app.registerModule( mod );
      }
    });
  }

  runConfigure(){
    this.readPluginNames();
  }

  runLoad():Promise<any>{
    return Promise.coroutine(function*( thisInstance ){
      for( let pluginName in thisInstance.plugins ){
        yield thisInstance.loadPlugin( pluginName );
      }
      yield thisInstance.registerModules(resolve( _p( thisInstance._app.get('appRoot'), 'modules' ) ))
    })(this);
  }

}


