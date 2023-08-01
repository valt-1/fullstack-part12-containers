import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders todo text', () => {
  const todo = {
    text: 'Write better tests',
    done: false
  }

  render(<Todo todo={todo} />)

  const element = screen.getByText('Write better tests')
  expect(element).toBeDefined()
})
