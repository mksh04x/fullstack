import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLike = async (blog) => {
    try {
      const blogs = await blogService.getAll()
      const index = blogs.findIndex((b) => b.id === blog.id)

      if (index !== -1) {
        const updatedBlog = { ...blogs[index], likes: blogs[index].likes + 1 }
        const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog)
        const updatedBlogs = [...blogs]
        updatedBlogs[index] = returnedBlog
        setBlogs(updatedBlogs)
      } else {
        console.error('Blog not found in the list.')
      }
    } catch (error) {
      console.error('Error handling like:', error.message, error.response)
    }
  }

  const delBlog = async (blog) => {
    const ifDel = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!ifDel) {
      return
    }
    try {
      await blogService.del(blog.id)
      setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id))
    } catch (exception) {
      alert(`Failed to delete blog: ${exception}`)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">login</button>
    </form>
  )

  const showBlog = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in
        <button id="logout" onClick={() => { window.localStorage.removeItem('loggedNoteappUser'), setUser(null) }}>logout</button>
      </p>
      {blogs.sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id}
            blog={blog}
            setBlogs={setBlogs}
            user={user}
            handleLike={handleLike}
            delBlog={delBlog}
          />
        )}
    </div>
  )

  const newBlog = async (e) => {
    e.preventDefault()
    try {
      const createdBlog = await blogService.create({
        title,
        author,
        url,
        likes: 0,
        userId: user.id
      })

      console.log('Blog created:', createdBlog)
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage(`A new blog ${createdBlog.title} by ${createdBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog">
      <BlogForm
        onSubmit={newBlog}
        title={title}
        author={author}
        url={url}
        setTitle={setTitle}
        setAuthor={setAuthor}
        setUrl={setUrl}
      />
    </Togglable>
  )


  const Notification = ({ message }) => {
    if (message === null || message === '') {
      return null
    }

    return (
      <div className="message">
        {message}
      </div>
    )
  }

  const Notification2 = ({ errorMessage }) => {
    if (errorMessage === null || errorMessage === '') {
      return null
    }

    return (
      <div className="errorMessage">
        {errorMessage}
      </div>
    )
  }


  return (
    <div>
      <Notification message={message} />
      <Notification2 errorMessage={errorMessage} />
      {!user && (
        <div>
          <h2>log in to application</h2>
          {loginForm()}
        </div>
      )}
      {user && showBlog()}
      {user && (
        <div>
          <h2>create new</h2>
          {blogForm()}
        </div>
      )}
    </div>
  )
}

export default App