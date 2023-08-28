import React, { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, addedByUser }) => {
  const blogStyle = {
    padding: 2,
    backgroundColor: '#fce3f9',
    margin: 3
  }

  const [showAll, setShowAll] = useState(false)

  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  const incrementLikes = (event) => {
    event.preventDefault()
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    updateBlog(updatedBlog, blog.id)
  }

  if (!showAll) {
    return (
      <div style={blogStyle} className='blog'>
        {blog.title} {blog.author} <button onClick={toggleShowAll}>view</button>
      </div>
    )
  }

  const removeButton = addedByUser
    ? <button onClick={deleteBlog}>remove</button>
    : ''

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author} <button onClick={toggleShowAll}>hide</button><br/>
      {blog.url}<br/>
      likes: {blog.likes} <button onClick={incrementLikes} id='likeButton'>like</button><br/>
      {blog.user.name}<br/>
      {removeButton}
    </div>
  )
}

export default Blog
