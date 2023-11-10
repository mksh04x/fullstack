const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let sum = 0
    for (const blog of blogs) {
        sum += blog.likes
    }
    return sum
}

const favoriteBlog = (blogs) => {
    let favorite = blogs[0]
    for (const blog of blogs) {
        if (blog.likes > favorite.likes) {
            favorite = blog
        }
    }
    const info = {
        author: favorite.author,
        title: favorite.title,
        likes: favorite.likes
    }
    return info
}

const mostBlogs = (blogs) => {
    let maxAuthor = ''
    let maxCount = 0
    let count = {}
    for (const blog of blogs) {
        if (!count[blog.author]) {
            count[blog.author] = 0
        }
        count[blog.author]++
        if (maxCount < count[blog.author]) {
            maxCount = count[blog.author]
            maxAuthor = blog.author
        }
    }
    const info = {
        author: maxAuthor,
        blogs: maxCount
    }
    return info
}

const mostLikes = (blogs) => {
    let maxAuthor = ''
    let sum = 0
    let likesByAuthor = {}

    for (const blog of blogs) {
        if (!(blog.author in likesByAuthor)) {
            likesByAuthor[blog.author] = 0
        }
        likesByAuthor[blog.author] += blog.likes
        if (sum < likesByAuthor[blog.author]) {
            sum = likesByAuthor[blog.author]
            maxAuthor = blog.author
        }

    }
    const info = {
        author: maxAuthor,
        likes: sum
    }
    return info
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
