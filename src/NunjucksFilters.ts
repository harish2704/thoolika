/* ഓം ബ്രഹ്മാർപ്പണം. */

/*
 * src/NunjucksFilters.ts
 * Created: Wed Mar 08 2017 13:27:44 GMT+0530 (IST)
 * Copyright 2017 Harish.K<harish2704@gmail.com>
 */


const config = require('tconfig');

export function siteUrl( str ){
  return config.siteRoot + '/' + str;
};


export function uploadUrl( fileObj ){
  fileObj = fileObj[0];
  if( fileObj && fileObj._id ){
    return config.staticRoot + '/uploads/' + fileObj._id;
  }
  return '';
};


export function staticUrl( str ){
  return config.staticRoot + '/' + str;
};
