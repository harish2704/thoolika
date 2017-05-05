/* ഓം ബ്രഹ്മാർപ്പണം. */

/*
 * src/EntityService.ts
 * Created: Sun Mar 12 2017 18:24:21 GMT+0530 (IST)
 * Copyright 2017 Harish.K<harish2704@gmail.com>
 */


import { get } from 'lodash';
import { Service } from './Types';
import EntityManager from './EntityManager';
import * as Promise from 'bluebird';

let entityManager:EntityManager;

function find( query, params={} ){
  const role = get( params, 'user.role', 'admin');
  return Promise.resolve( entityManager.list( role ) );
}



function setup( app ){
  entityManager = app.entityManager;
  return Promise.resolve();
}

const EntityService = <Service> {
  name: 'core.entity',
  find: find,
  setup: setup
};

export default EntityService;
