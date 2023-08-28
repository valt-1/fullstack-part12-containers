const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  const body = Object.assign({}, request.body)
  if (request.path === '/api/users' || request.path === '/api/login') body.password = '***'
  const bodyToLog = request.method === 'POST' || request.method === 'PUT'
    ? JSON.stringify(body)
    : ''
  logger.info(`${request.method} ${request.path} ${bodyToLog}`)
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response
      .status(400)
      .send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response
      .status(400)
      .json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response
      .status(401)
      .json({ error: 'invalid token' })
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    const error = { error: 'token missing or invalid' }
    logger.error(error.error)
    return response
      .status(401)
      .json(error)
  }

  request.user = await User.findById(decodedToken.id)
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
