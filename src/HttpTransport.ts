/* ഓം ബ്രഹ്മാർപ്പണം. */

/*
 * src/HttpTransport.ts
 * Created: Wed Mar 08 2017 13:27:13 GMT+0530 (IST)
 * Copyright 2017 Harish.K<harish2704@gmail.com>
 */


import {ThoolikaApplication, ThoolikaServiceResponse, Transport, Service } from './Types';
import * as _ from 'lodash';
const bodyParser = require('body-parser');


const debug = require('debug')('Thoolika::HttpTransport:debug');

interface FinalResult{
  $redirect?: string
  $html?: string
}

export default class RestTransport implements Transport {

  name = 'RestTransport';

  /* service action name to http method hash map */
  static readonly httpActionsMap = {
    create: 'post',
    get: 'get',
    find: 'get',
    update: 'put',
    patch: 'patch',
    remove: 'delete',
  };

  static readonly urlSuffixMap = {
    create: '',
    find: '',
    get: '/:id',
    update: '/:id',
    patch: '/:id',
    remove: '/:id',
  }


  /**
   *  Send the data as a HTTP response.
   *  if data.$redirect is set and , request is not accepting json, it will send a 3xx redirect response
   *  if data.$html is set and request is not accepting json, it will send a text/html response with data.$html as content
   */
  static sendAsReponse(req, res) {
    const data = res.locals.data;
    const extraData = <FinalResult> _.pick(data, '$redirect', '$html');
    const acceptedType = req.accepts(['html', 'json']);
    if (data.hasOwnProperty('$redirect')) {
      delete data.$redirect;
    }
    if (data.hasOwnProperty('$html')) {
      delete data.$html;
    }

    if (acceptedType === 'html') {
      if (extraData.hasOwnProperty('$redirect')) {
        return res.redirect(extraData.$redirect);
      }
      if (extraData.hasOwnProperty('$html')) {
        return res.send(extraData.$html);
      }
      return res.send(JSON.stringify({success: true, data: data}));
    }
    return res.send({success: true, data: data});
  }

  static setData( data, next, res ){
    res.locals.data = data;
    next();
  }


  /**
   *  Register a route handler for a given HTTP action, path etc
   */
  static mountRoute(app, service, action) {
    const beforeMiddlewares = _.get(service, '$middlewares.before.'+ action, []);
    const afterMiddlewares = _.get(service, '$middlewares.after.'+ action, []);
    const prefix = app.get('restifyPrefix') || '/api/';
    const mountPath = service.name + this.urlSuffixMap[action];
    const httpAction = this.httpActionsMap[action];
    const fn = this[action + 'Handler']( action, service );

    debug( 'Mounting Route: ' + prefix + ' '+httpAction+' ' + mountPath );
    app[httpAction]( prefix + mountPath, beforeMiddlewares.concat([fn], afterMiddlewares, [this.sendAsReponse]));
  }

  static findHandler( actin, service ){
    return ( req, res, next ) =>{
      service.find( req.query, { req, res } ).then( data => this.setData( data, next, res ) ).catch(next);
    }
  }

  static createHandler( action, service ){
    return (req, res, next )=>{
      service.create( req.body, { req, res } ).then( data => this.setData( data, next, res ) ).catch(next);
    }
  }

  static patchHandler( action, service ){
    return ( req, res, next ) => {
      service.patch( req.params.id, req.body, { req, res } ).then( data => this.setData( data, next, res ) ).catch( next );
    }
  }

  static updateHandler( action, service ){
    return ( req, res, next ) => {
      service.update( req.params.id, req.body, { req, res } ).then( data => this.setData( data, next, res ) ).catch( next );
    }
  }

  static getHandler( action:string, service ){
    return ( req, res, next ) => {
      service.get( req.params.id, { req, res } ).then( data => this.setData( data, next, res ) ).catch( next );
    }
  }

  static removeHandler( action:string, service ){
    return ( req, res, next ) => {
      service.remove( req.params.id, { req, res } ).then( data => this.setData( data, next, res ) ).catch( next );
    }
  }


  static unMountAction( action, app, service ){
    throw new Error('unMountAction is Not impemented');
  }



  /**
   *  Mount all actions of given service
   */
  mountService(service:Service, app:ThoolikaApplication) {

    let action;
    for (action in RestTransport.httpActionsMap) {
      if (service[action] !== undefined ) {
        RestTransport.mountRoute(app, service, action);
      }
    }
  }


  /**
   *  Unmount all actions of given service
   */
  unMountService(service:Service, app:ThoolikaApplication) {
    let action;
    for (action in RestTransport.httpActionsMap) {
      if (service[action] !== undefined ) {
        RestTransport.unMountAction(action, app, service);
      }
    }
  }

  setup( app:ThoolikaApplication ){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    return Promise.resolve();
  }
}
