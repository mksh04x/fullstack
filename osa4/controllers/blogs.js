const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = request.user

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }
    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
      user: user._id
    })

    if (!blog.title || !blog.url) {
      return response.status(400).send({ error: 'must include title and url' })
    }

    if (blog.likes === undefined || blog.likes === null) {
      blog.likes = 0
    } else {
      try {
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(blog)
      } catch (error) {
        response.status(400).send(error)
      }
    }
  } catch (tokenError) {
    response.status(401).json({ error: 'Token missing or malformed' });
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  const user = request.user

  if (decodedToken.id !== blog.user.toString()) {
    return response.status(401).json({ error: 'you didnt make this blog' });
  }
  await Blog.findByIdAndRemove(request.params.id);

  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  Blog.findByIdAndUpdate(request.params.id, { likes: request.body.likes }, { new: true })
    .then(updatedLikes => {
      if (updatedLikes) {
        response.json(updatedLikes)
      } else {
        response.status(404).end()
      }
    })
})

module.exports = blogsRouter
