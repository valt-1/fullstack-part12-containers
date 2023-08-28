const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

describe('when there are some blogs initially saved in DB', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  describe('GET /api/blogs', () => {

    test('responds with json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('responds with correct number of blogs', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('id property of blog is formatted correctly', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body[0].id).toBeDefined()
    })

  })

  describe('GET /api/blogs/:id', () => {

    test('viewing a blog succeeds when id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const response = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body).toEqual(blogToView)
    })

    test('responds with 404 if blog with given id does not exist', async () => {
      const id = await helper.nonExistingId()
      await api
        .get(`/api/blogs/${id}`)
        .expect(404)
    })

    test('responds with 400 if id is invalid', async () => {
      const id = 'asdf'
      await api
        .get(`/api/blogs/${id}`)
        .expect(400)
    })

  })

  describe('POST /api/blogs', () => {

    describe('when user is authenticated with token', () => {

      let token

      beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({
          username: 'user1',
          passwordHash
        })
        await user.save()

        const response = await api
          .post('/api/login')
          .send({
            username: 'user1',
            password: 'secret'
          })
        token = response.body.token
      })

      test('adds valid blog with correct properties', async () => {
        const newBlog = {
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          likes: 12
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .set({ Authorization: `bearer ${token}` })
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const titles = blogsAtEnd.map(blog => blog.title)

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        expect(titles).toContain('Canonical string reduction')
      })

      test('sets likes to 0 if likes property is not specified', async () => {
        const newBlog = {
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
        }

        const response = await api
          .post('/api/blogs')
          .send(newBlog)
          .set({ Authorization: `bearer ${token}` })

        expect(response.body.likes).toBe(0)
      })

      test('does not add blog with no title, responds with 400', async () => {
        const newBlog = {
          author: 'Edsger W. Dijkstra',
          url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          likes: 12
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .set({ Authorization: `bearer ${token}` })
          .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      })

      test('does not add blog with no url, responds with 400', async () => {
        const newBlog = {
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          likes: 12
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .set({ Authorization: `bearer ${token}` })
          .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      })

    })

    describe('when no token is provided', () => {

      test('does not add blog without token, responds with 401', async () => {
        const newBlog = {
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          likes: 12
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      })


    })

  })

})

describe('when there is one user initially saved in DB', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({
      username: 'user1',
      passwordHash
    })
    await user.save()
  })

  describe('POST /api/users', () => {

    test('adds valid user with unused username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'doge',
        name: 'Jean Shibelius',
        password: 'topsecret'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      const usernames = usersAtEnd.map(user => user.username)

      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
      expect(usernames).toContain(newUser.username)
    })

    test('does not add user if username taken, responds with 400 and error message', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'user1',
        name: 'Jane Smith',
        password: 'secret123'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      expect(result.body.error).toContain('username')
      expect(result.body.error).toContain('unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('does not add user without username, responds with 400 and error message', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: 'Jane Smith',
        password: 'secret123'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      expect(result.body.error).toContain('username')
      expect(result.body.error).toContain('required')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('does not add user if username is too short, responds with 400 and error message', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'js',
        name: 'Jane Smith',
        password: 'secret123'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      expect(result.body.error).toContain('username')
      expect(result.body.error).toContain('shorter than the minimum allowed length')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('does not add user without password, responds with 400 and error message', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'user1',
        name: 'Jane Smith'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      expect(result.body.error).toContain('password is required')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('does not add user if password is too short, responds with 400 and error message', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'user1',
        name: 'Jane Smith',
        password: 'js'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      expect(result.body.error).toContain('password must be at least 3 characters')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })

})

afterAll(() => {
  mongoose.connection.close()
})
