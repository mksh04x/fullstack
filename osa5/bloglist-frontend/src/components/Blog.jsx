import Togglable from './Togglable'
import blogService from '../services/blogs'
import blogs from '../services/blogs'

const Blog = ({ blog, setBlogs, user, delBlog, handleLike }) => {

  return (
    <div>
      <div className="nimi" style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', border: 'solid', borderWidth: '1px', borderColor: '#800000' }}>
        <p>{blog.title}&nbsp;</p>
        <Togglable buttonLabel='view'>
          <span>
            {blog.author} likes: {blog.likes} <button id="like" onClick={() => handleLike(blog)}>like</button> {blog.url}
            {user && blog.user && user.username === blog.user.username && <button id="remove" onClick={() => delBlog(blog)}>remove</button>}
          </span>
        </Togglable>
      </div>
    </div>
  )
}


export default Blog
