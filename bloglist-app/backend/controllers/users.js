const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password === undefined) {
    const error = {
      error: 'User validation failed: password is required'
    }
    logger.error(error.error)
    return response
      .status(400)
      .json(error)
  } else if (body.password.length < 3) {
    const error = {
      error: 'User validation failed: password must be at least 3 characters'
    }
    logger.error(error.error)
    return response
      .status(400)
      .json(error)
  }

  const passwordHash = await bcrypt.hash(body.password, 10)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

module.exports = usersRouter
