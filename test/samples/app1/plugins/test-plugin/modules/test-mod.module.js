
exports.services = [{
  name: 'servicePa',
  create: function( data ){ data = Object.assign( { id: Date.now() }, data ); return Promise.resolve( data ); }
}];
