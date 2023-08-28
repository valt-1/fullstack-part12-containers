const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined

  let favorite = blogs[0]
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > favorite.likes) favorite = blogs[i]
  }

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return undefined

  const blogCountObject = lodash.countBy(blogs, 'author')
  const blogCountPairs = lodash.toPairs(blogCountObject)

  let most = blogCountPairs[0]
  for (let i = 0; i < blogCountPairs.length; i++) {
    if (blogCountPairs[i][1] > most[1]) most = blogCountPairs[i]
  }

  return { author: most[0], blogs: most[1] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return undefined

  const blogsByAuthor = lodash.groupBy(blogs, 'author')

  const reduceToLikes = (blogList) => blogList.reduce((sum, blog) => sum + blog.likes, 0)
  const likesByAuthor = lodash.mapValues(blogsByAuthor, reduceToLikes)
  const likeCountPairs = lodash.toPairs(likesByAuthor)

  let most = likeCountPairs[0]
  for (let i = 0; i < likeCountPairs.length; i++) {
    if (likeCountPairs[i][1] > most[1]) most = likeCountPairs[i]
  }

  return { author: most[0], likes: most[1] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
