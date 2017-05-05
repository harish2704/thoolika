

var service  = {
  name: 'page',
  get: function(id){ return Promise.resolve({id: id, title: 'Page ' + id }); }
};

var entity = {
  name: 'page',
};

module.exports = {
  services: [ service ],
  entity: entity,
  forms: []
};
