import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const blogFormRef = useRef()

  const [notification, setNotification] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState (null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((b1, b2) => b2.likes - b1.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        notify(`added blog "${blogObject.title}" by ${blogObject.author}`)
      })
      .catch(() => {
        notify('adding new blog failed, provide at least blog title and url')
      })
  }

  const updateBlog = (blogObject, blogId) => {
    blogService
      .update(blogObject, blogId)
      .then(blogService.getAll()
        .then(blogs => setBlogs(blogs.sort((b1, b2) => b2.likes - b1.likes))))
      .catch((error) => {
        notify(error.message)
      })
  }

  const deleteBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService
        .remove(blog.id)
        .then(blogService.getAll()
          .then(blogs => {
            setBlogs(blogs
              .filter(b => b.id !== blog.id)
              .sort((b1, b2) => b2.likes - b1.likes))
            notify(`Removed blog ${blog.title} by ${blog.author}`)
          })
          .catch((error) => {
            notify(error.message)
          }))
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notify('login failed')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    notify('logged out')
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog}/>
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>log in</h2>
        <Notification message={notification} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      {blogForm()}
      <span className='blogList'>
        {blogs.map(blog =>
          <Blog
            key={blog.id} blog={blog}
            updateBlog={updateBlog}
            deleteBlog={() => deleteBlog(blog)}
            addedByUser={blog.user.name === user.name}
          />
        )}
      </span>
    </div>
  )
}

export default App