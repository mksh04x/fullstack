const BlogForm = ({ onSubmit, title, author, url, setTitle, setAuthor, setUrl }) => {
  return (

    <form onSubmit={onSubmit}>
      <div>
            title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          id='title-input'
        />
      </div>
      <div>
            author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          id='author-input'
        />
      </div>
      <div>
            url:
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          id='url-input'
        />
      </div>
      <button id="submit" type="submit" data-testid='submitButton'>create</button>
    </form>
  )
}

export default BlogForm