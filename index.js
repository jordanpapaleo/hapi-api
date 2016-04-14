const Hapi = require('hapi')
const Boom = require('Boom')
const server = new Hapi.Server()

const goodOptions = {
  reporters: [{
    reporter: require('good-console'),
    events: { log: '*', response: '*' }
    // events: { log: ['error'], response: '*' }
  }]
}

function handler (request, reply) {
  // reply(error, data) error is optional
  // Promose.resolve('hello')
  // reply(new Error('agggg')) // Throes 500
  // reply(Boom.notFound()) // 404
  reply(request.params)
    .code(200)
    .type('text/json')
    .header('hello', 'world')
    .state('hello', 'world') // Cookie

}

server.register({
  register: require('good'),
  options: goodOptions
}, (err) => {
  server.connection({
    port: 8888
  })

  server.route({
    method: ['POST', 'PUT'],
    path: '/users',
    config: {
      payload: {
        output: 'data',
        parse: true,
        allow: 'application/json'
      }
    },
    handler: function(request, reply) {
      reply(request.payload)
    }
  })

  server.route({
    method: 'GET',
    path: '/users/{userId?}', // ? optionable http://localhost:8888/users/asddas
    // path: '/users/{userId}/{profile}.jpg', // file type specific
    // path: '/users/{userId}/files', // http://localhost:8888/users/asddas/files
    // path: '/users/{userId*}', // http://localhost:8888/users/asddas/files/sdfas/sdfs/sfsreer/gdfsd
    // path: '/users/{userId*2}', // http://localhost:8888/users/asddas/vadf
    handler: handler
  })

  server.start(() => {
    console.log(`Server started at: ${server.info.uri} `)
  })
})
