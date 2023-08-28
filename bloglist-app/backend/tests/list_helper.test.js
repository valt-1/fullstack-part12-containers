const listHelper = require('../utils/list_helper')

const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

describe('dummy', () => {

  test('returns 1', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })

})

describe('total likes', () => {

  test('returns correct number of likes', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })

  test('returns the likes of the blog when list has only one blog', () => {
    const result = listHelper.totalLikes([blogs[0]])
    expect(result).toBe(7)
  })

  test('returns 0 when blog list is empty', () =>  {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

})

describe('favorite blog', () => {

  test('returns blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(blogs[2])
  })

  test('returns the only blog when list has only one blog', () => {
    const result = listHelper.favoriteBlog([blogs[0]])
    expect(result).toEqual(blogs[0])
  })

  test('returns undefined when blog list is empty', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBeUndefined()
  })

})

describe('most blogs', () => {

  test('returns author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })

  test('returns the only author when list has only one blog', () => {
    const result = listHelper.mostBlogs([blogs[0]])
    expect(result).toEqual({ author: 'Michael Chan', blogs: 1 })
  })

  test('returns undefined when blog list is empty', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBeUndefined()
  })

})

describe('most likes', () => {

  test('returns author with the most likes', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })

  test('returns the only author when list has only one blog', () => {
    const result = listHelper.mostLikes([blogs[0]])
    expect(result).toEqual({ author: 'Michael Chan', likes: 7 })
  })

  test('returns undefined when blog list is empty', () => {
    const result = listHelper.mostLikes([])
    expect(result).toBeUndefined()
  })

})
