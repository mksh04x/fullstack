import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'


test('renders content', () => {
  const blog = {
    title: 'test title'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('test title')
  expect(element).toBeDefined()
})

test('test rendering author url and likes after clicking view', async () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 7357
  }
  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const title = screen.queryByText('test title')
  const author = screen.queryByText('test author')
  const url = screen.queryByText('test url')
  const likes = screen.queryByText('7357')

  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('test double like', async () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 7357
  }
  const mockHandler = jest.fn()
  render(<Blog blog={blog} handleLike={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = await screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('test creating a blog', async () => {
  const blog = {
    title: 'new test title',
    author: 'new test author',
    url: 'https://www.google.com',
    likes: 7357
  }
  const user = userEvent.setup()
  const onSubmit = jest.fn()
  const setTitle = jest.fn()
  const setAuthor = jest.fn()
  const setUrl = jest.fn()

  const { container } = render(<BlogForm onSubmit={onSubmit}
    setTitle={setTitle}
    setAuthor={setAuthor}
    setUrl={setUrl}
  />)


  const submitButton = await screen.getByTestId('submitButton')
  await user.type(container.querySelector('#title-input'), blog.title)
  await user.type(container.querySelector('#author-input'), blog.author)
  await user.type(container.querySelector('#url-input'), blog.url)
  await user.click(submitButton)

  expect(onSubmit.mock.calls.length).toBe(1)

  expect(onSubmit.mock.calls[0][0].target.querySelector('#title-input').value).toBe('new test title')
  expect(onSubmit.mock.calls[0][0].target.querySelector('#author-input').value).toBe('new test author')
  expect(onSubmit.mock.calls[0][0].target.querySelector('#url-input').value).toBe('https://www.google.com')
})
