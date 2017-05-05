
module.exports = {
  "host": "localhost",
  "port": 3030,
  "mongodb": "mongodb://localhost:27017/app1",
  "siteRoot": "/v1",
  "staticRoot": "/v1/static",
  "auth": {
    "token": {
      "secret": "2ajksdgh2aklsdf2askldf2al;ksdfj2akl;sdf",
      "expiresIn": "30d",
      "algorithm": "HS256",
      "issuer": "feathers"
    },
    "local": {},
    "cookie":{
      "name": "feathers-jwt"
    },
    "shouldSetupSuccessRoute": false,
    "shouldSetupFailureRoute": false,
    "failureRedirect": false
  },
  "siteName": "example.com",
  "paginationLimit": 10,
  restifyPrefix: '/api/',
  appRoot: __dirname + '/..'
};
