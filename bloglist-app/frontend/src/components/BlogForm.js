import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const handleTitleChange = (event) => {
    setBlogTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setBlogAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setBlogUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    })
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <div>
      <h3>add blog</h3>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type='text'
            value={blogTitle}
            id='blogTitle'
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={blogAuthor}
            id='blogAuthor'
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={blogUrl}
            id='blogUrl'
            onChange={handleUrlChange}
          />
        </div>
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
