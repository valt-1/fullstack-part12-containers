import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 999,
    user: {
      name: 'D. E. Veloper'
    }
  }
  const updateBlog = jest.fn()

  const options = { exact: false }

  beforeEach(() => {
    render(<Blog blog={blog} updateBlog={updateBlog} />)
  })

  test('Only blog title and author are rendered', () => {
    const title = screen.getByText('React patterns', options)
    const author = screen.getByText('Michael Chan', options)
    expect(title).toBeDefined()
    expect(author).toBeDefined()

    const url = screen.queryByText('https://reactpatterns.com/', options)
    const likes = screen.queryByText('999', options)
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('Blog url and likes are also rendered when button clicked', () => {
    const button = screen.getByText('view')
    userEvent.click(button)

    const url = screen.getByText('https://reactpatterns.com/', options)
    const likes = screen.getByText('999', options)
    const title = screen.getByText('React patterns', options)
    const author = screen.getByText('Michael Chan', options)
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(title).toBeDefined()
    expect(author).toBeDefined()
  })

  test('Blog update event handler called twice when like button clicked twice', () => {
    const viewButton = screen.getByText('view')
    userEvent.click(viewButton)

    const likeButton = screen.getByText('like')
    userEvent.click(likeButton)
    userEvent.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })

})
