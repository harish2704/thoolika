/* ഓം ബ്രഹ്മാർപ്പണം. */

/*
 * src/EntityManager.ts
 * Created: Wed Mar 08 2017 11:45:52 GMT+0530 (IST)
 * Copyright 2017 Harish.K<harish2704@gmail.com>
 */
const warn = require('debug')('Thoolika::EntityManager:warn');
const debug = require('debug')('Thoolika::EntityManager:debug');
import { Entity } from './Types';


export default class EntityManager{

  items: Array<Entity>;

  constructor(){
    this.items = []
  }


  /**
   *  Register an Entity.
   *  Items registered here will be listed in the admin panel for all users with required role name is 
   */
  register( entity:Entity ){
    this.items.push( entity );
  }

  /**
   * retrieve the list entities to be shown to a specific role name
   */
  list( role ): Array<Entity>{
    return this.items.filter( v=> v.visibleTo.indexOf(role) !== -1 )
  }


  /**
   *  Get a single entity
   */
  /**
   *  get( name:string, role:string ):Entity{
   *    return this.items.filter( v=> {
   *      ( v.name === name ) && ( v.visibleTo.indexOf(role) !== -1 );
   *    })[0];
   *  }
   */

}
