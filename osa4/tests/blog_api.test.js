const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const User = require('../models/user')
const Blog = require('../models/blog')


const initialBlogs = [
    {
        title: 'test',
        author: 'Test Author',
        url: 'http://www.google.com',
        likes: 1
    },
    {
        title: 'test2',
        author: 'Test Author2',
        url: 'http://www.yahoo.com',
        likes: 2
    },
]


beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})


test('right amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
})

test('test that id is right', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
        expect(blog.id).toBeDefined();
    })
})

test('test adding blogs', async () => {

    const user = await api
        .post('/api/users')
        .send({ username: "lokki123", name: "mina", password: process.env.SECRET })

    const login = await api
        .post('/api/login')
        .send({ username: "lokki123", password: process.env.SECRET })

    const token = login.body.token

    const newBlog = new Blog({
        title: "new test",
        author: "New Test Author",
        url: "https://www.example.com",
        likes: 32
    })
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
    const res = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)

    await newBlog.save()
    const response2 = await api.get('/api/blogs')
    expect(response2.body).toHaveLength(3)
})


test('test no likes', async () => {

    const user = await api
        .post('/api/users')
        .send({ username: "lokki123", name: "mina", password: process.env.SECRET })

    const login = await api
        .post('/api/login')
        .send({ username: "lokki123", password: process.env.SECRET })

    const token = login.body.token

    const newBlog = new Blog({
        title: "arvo",
        author: "author",
        url: "https://www.nolikes.org",
    })
    if (newBlog.likes === undefined) {
        newBlog.likes = 0
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)

    await newBlog.save()
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
        expect(blog.likes).toBeDefined();
    })
})




test('test no title no url', async () => {

    const login = await api
        .post('/api/login')
        .send({ username: "lokki123", password: process.env.SECRET })

    const token = login.body.token

    const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'testpassword',
    };

    const userResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(201);

    const newBlog = new Blog({
        author: "author",
    })
    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...newBlog, userId: userResponse.body.id })
        .expect(400);
})




test('testing delete', async () => {

    const user = await api
        .post('/api/users')
        .send({ username: "lokki123", name: "mina", password: process.env.SECRET })

    const login = await api
        .post('/api/login')
        .send({ username: "lokki123", password: process.env.SECRET })

    const token = login.body.token

    const deleteThisBlog = new Blog({
        title: "this shouldnt be here",
        author: "test",
        url: "https://www.test.com",
        likes: 112
    })
    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(deleteThisBlog)
    await api
        .delete(deleteThisBlog)
})


test('testing updating likes', async () => {

    const user = await api
        .post('/api/users')
        .send({ username: "lokki123", name: "mina", password: process.env.SECRET })

    const newUser = {
        username: 'testiuseri',
        name: 'tsttst',
        password: 'password',
    };

    const userResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(201);

    const login = await api
        .post('/api/login')
        .send({ username: newUser.username, password: newUser.password })

    const token = login.body.token

    const newBlog = {
        title: 'sadasdasadsaas',
        author: 'Nasdadsadsasasad',
        url: 'https://www.asd.com',
        likes: 32,
    };

    const blogResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...newBlog, userId: userResponse.body.id })
        .expect(201);

    const blogId = blogResponse.body.id;

    const updatedLikes = {
        likes: 15,
    };

    const updateResponse = await api
        .put(`/api/blogs/${blogId}`)
        .send(updatedLikes)
        .expect(200);

    expect(updateResponse.body.likes).toBe(updatedLikes.likes);
});

test('test unauthorized blogpost', async () => {

    const user = await api
        .post('/api/users')
        .send({ username: "lokki123", name: "mina", password: process.env.SECRET })

    const login = await api
        .post('/api/login')
        .send({ username: "lokki123", password: process.env.SECRET })

    const token = login.body.token

    const newBlog = new Blog({
        title: "new test",
        author: "New Test Author",
        url: "https://www.example.com",
        likes: 32
    })
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
    const res = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        expect(res.body.error).toContain('Token missing or malformed')
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('Username is already taken')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('test invalid pass & username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'as',
            name: 'Superuser',
            password: 'as',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Username must be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})