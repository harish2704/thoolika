/* ഓം ബ്രഹ്മാർപ്പണം. */

/*
 * src/Types.d.ts
 * Created: Thu Mar 16 2017 13:07:17 GMT+0530 (IST)
 * Copyright 2017 Harish.K<harish2704@gmail.com>
 */


import { Request, Response, Application } from 'express';
import * as Promise from 'bluebird';
import PluginManager from './PluginManager';
import EntityManager from './EntityManager';
import ViewsManager from './ViewsManager';
import ServiceManager from './ServiceManager';

export interface ThoolikaApplicationOptions{
  transports?: Array<Transport>

  /**
   *  list of extra plugins. each item is npm module name, and plugin directory is resolved via 'require.resolve' function
   */
  plugins?: Array<string>
}


export interface ThoolikaServiceResponse extends Object{
  $html?:string;
  $redirect?:string;
}

/**
 *  Represents a Thoolika app object.
 *  Its actually a express Application object which has some extra properties
 */
export interface ThoolikaApplication extends Application{

  /**
   *  A Plugin manager instance resposible for managing plugin registraion, loading etc
   */
  pluginManager?: PluginManager;

  /**
   *  Entity, or Data-models manager instance which is responsible managing Entities registered in the application
   */
  entityManager?: EntityManager;


  /**
   *  Each plugin can have its own template directories and templates ( Nunjucks tempaltes ).
   *  All of those templates can be overriden by the main applicaiton if requierd.
   *  This viewsManager instance mangaes those tempalte directories of each plugin and main application instance
   */
  viewsManager?: ViewsManager;

  /**
   *  Each entity is exposted to client-side through an Interface called [[ Service ]]
   */
  serviceManager?: ServiceManager;


  /**
   *  Register a module in the application.
   *  A module is collection of entities and services
   */
  registerModule( thoolikaModule:ThoolikaModule ):Promise<any>;

}


export interface ThoolikaModule{
  entities?: Array<Entity>
  services?: Array<Service>
  setup?( app:ThoolikaApplication ):Promise<null>
}

export interface ThoolikaPluginMain{
  // configure?( app:ThoolikaApplication ): Promise<any>
  setup?( app:ThoolikaApplication ): Promise<any>

  // uninstall?( app:ThoolikaApplication ): Promise<any>
  // postUninstall?( app:ThoolikaApplication ): Promise<any>
}

/**
 *  A representation of a thoolika Plugin.
 *  A plugin can be stored either in 'plugins' directory of main application or can be a normal npm module.
 *  In either case, in additional to a normal npm module, A ThoolikaPlugin has following additional features
 *  * if a directory named 'views' exists in the root of the plugin, It will be added to [tempalte engine's](Nunjucks) search path
 *  * if a directory named 'static' exists in the root of the plugin, It will be registered in with staticDirManager
 *  * if a directory named 'modules' exists, each files and directory matches '*.module*' patern will be cosidered as a ThoolikaModule. All of these modules will get registered with application instance.
 */
export interface ThoolikaPlugin {

  /**
   *  Name of the plugin from Package.json
   */
  name:string;

  /**
   *  Description from package.json
   */
  description:string;

  /**
   *  Author string from package.json
   */
  author: string;

  /**
   *  Version from package.json
   */
  version: string;

  /**
   *  Peer dependency requirement from package.json
   */
  requiredPlatformVersion: string;

  /**
   *  Full path of plugin directoy
   */
  pluginDir:string;


  /**
   *  main exported values plugin package
   */
  main: ThoolikaPluginMain
}


/**
 *  Represents params passed to each service.
 *  ServiceParams are provided for extra flexibility for each service actions.
 */
export interface ServiceParams{

  /**
   *  Request object from express
   */
  req: Request,

  /**
   *  Response object from express
   */
  res: Response,
}

export interface ThoolikaFindQuery {
  /**
   *  The Query object.
   */
  query?: {
    [key:string]: any
  },

  limit?: string|number
  skip?: string|number
  sort?: any
}

/**
 *  Represents ideal response from a find action
 */
export interface ThoolikaFindResponse{
  items?: Array<any>
  total?: number
  skip?: number
  sort?: any
}

export interface Service{

  /*
   * Name of the service
   */
  name:string

  /*
   * get a single item
   */
  get?( id, params:ServiceParams ): Promise<any>

  /*
   * search items
   */
  find?( query:ThoolikaFindQuery, params:ServiceParams ): Promise<ThoolikaFindResponse>

  /*
   * create an item
   */
  create?( data:any, params:ServiceParams ): Promise<any>

  /*
   * Update an item
   */
  update?( id, data:any, params:ServiceParams ): Promise<any>

  /*
   * delete an item
   */
  delete?( id, params:ServiceParams ): Promise<any>

  /*
   * patch an item
   */
  patch?( id, data:any, params:ServiceParams ): Promise<any>


  /*
   * setup function to be called before mouting the application
   */
  setup?( app:ThoolikaApplication ): Promise<any>

  /**
   *  called before unmounting the service
   */
  uninstall?( app:ThoolikaApplication, transport:Transport ): Promise<any>
}


export interface Transport {

  /**
   *  Name of the transport
   */
  name: string

  /*
   * Mount a service into the given application.
   */
  mountService( service: Service, app:ThoolikaApplication )

  /**
   *  Unmount a service from the given application
   */
  unMountService( service: Service, app:ThoolikaApplication )

  /**
   *  Optional setup function which will get called at configuration stage
   */
  setup?( app:ThoolikaApplication ):Promise<any>
}


export interface Form{

  /**
   * schema defnition 
   */
  schemaDef:Object;

  /**
   * form defnition 
   */
  formDef:Object;

}

export interface Entity{

  /**
   *  Default form to be used form add/edit
   */
  defaultForm:Form;

  /*
   * Actual name of the model.
   * This will be used while fetching form details from FormsManager
   */
  name:string;

  /*
   * Display name used in presentation logic
   */
  displayName:string;

  /**
   *  Name of the default service which is used to add/edit/delete this item
   *  Each forms can use a custom service if required. But this will be used by default for all `form`
   */
  service:string;

  /*
   * The role names to which, this entity is visible
   */
  visibleTo:Array<string>;


  /*
   * list of column names to be listed on Entity-list page.
   */
  listColumns:Array<string>;

  /*
   * HTML class to be applied while listig this entity in sidebar.
   * We can give custom icon classes here.
   */
  listClassName?:string;


  /**
   *  custom for for *add* operation
   */
  addForm?:Form;

  /**
   *  custom for for *edit* operation
   */
  editForm?:Form;


}

