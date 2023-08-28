import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm component', () => {
  test('Function createBlog called with correct arguments when new blog added', () => {
    const createBlog = jest.fn()

    const component = render(<BlogForm createBlog={createBlog} />)

    const titleInput = component.container.querySelector('#blogTitle')
    const authorInput = component.container.querySelector('#blogAuthor')
    const urlInput = component.container.querySelector('#blogUrl')
    const saveButton = screen.getByText('save')

    userEvent.type(titleInput, 'React patterns')
    userEvent.type(authorInput, 'Michael Chan')
    userEvent.type(urlInput, 'https://reactpatterns.com/')
    userEvent.click(saveButton)

    expect(createBlog.mock.calls).toHaveLength(1)

    const mockCallObject = createBlog.mock.calls[0][0]

    expect(mockCallObject.title).toBe('React patterns')
    expect(mockCallObject.author).toBe('Michael Chan')
    expect(mockCallObject.url).toBe('https://reactpatterns.com/')
  })

})