describe ('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      name: 'Rata-Marjatta',
      username: 'ratis',
      password: 'password123'
    }, )
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in')
    cy.get('#username')
    cy.get('#password')
    cy.get('#loginButton')
  })

  describe('Login', function() {

    it('succeeds with correct credentials', function() {
      cy.get('#username').type('ratis')
      cy.get('#password').type('password123')
      cy.get('#loginButton').click()

      cy.contains('Rata-Marjatta logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('ratis')
      cy.get('#password').type('topsecret')
      cy.get('#loginButton').click()

      cy.contains('login failed')
    })

  })

  describe('When logged in', function() {

    beforeEach(function() {
      cy.login({ username: 'ratis', password: 'password123' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()

      cy.get('#blogTitle').type('Canonical string reduction')
      cy.get('#blogAuthor').type('Edsger W. Dijkstra')
      cy.get('#blogUrl').type('http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')
      cy.contains('save').click()

      cy.contains('added blog')
      cy.get('.blogList').contains('Canonical string reduction Edsger W. Dijkstra')
    })

    describe('When there is a blog with 0 likes existing in database', function() {

      beforeEach(function() {
        cy.createBlog({
          title: 'First class tests',
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
        })
      })

      it('Blog can be liked', function() {
        cy.get('.blogList')
          .contains('First class tests')
          .contains('view')
          .click()

        cy.get('.blogList')
          .contains('First class tests')
          .get('#likeButton')
          .click()

        cy.get('.blogList')
          .contains('First class tests')
          .contains('likes: 1')
      })

      it('Blog can be removed by user that added blog', function() {
        cy.get('.blogList')
          .contains('First class tests')
          .contains('view')
          .click()

        cy.get('.blogList')
          .contains('First class tests')
          .contains('remove')
          .click()

        cy.get('.blogList')
          .contains('First class tests')
          .should('not.exist')
      })

    })

    describe('When there are 3 blogs in database', function() {

      beforeEach(function() {
        cy.createBlog({
          title: 'First class tests',
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
          likes: '1'
        })
        cy.createBlog({
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
          likes: '2'
        })
        cy.createBlog({
          title: 'React patterns',
          author: 'Michael Chan',
          url: 'https://reactpatterns.com/',
          likes: '3'
        })
      })

      it('Blogs are ordered by likes', function() {
        cy.get('.blog').then(blogs => {
          cy.wrap(blogs[0]).contains('React patterns')
          cy.wrap(blogs[1]).contains('Canonical string reduction')
          cy.wrap(blogs[2]).contains('First class tests')
        })

        for (let i = 0; i < 3; i++) {
          cy.visit('http://localhost:3000')
          cy.get('.blog')
            .contains('First class tests')
            .contains('view')
            .click()
          cy.wait(500)
          cy.get('.blog')
            .contains('First class tests')
            .get('#likeButton')
            .click()
          cy.wait(1000)
        }

        cy.get('.blog').then(blogs => {
          cy.wrap(blogs[0]).contains('First class tests')
          cy.wrap(blogs[1]).contains('React patterns')
          cy.wrap(blogs[2]).contains('Canonical string reduction')
        })
      })

    })

  })

})
