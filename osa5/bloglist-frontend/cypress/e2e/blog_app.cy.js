describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'mina',
      username: 'lokki123',
      password: 'seppo123'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
  })
  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('lokki123')
      cy.get('#password').type('seppo123')
      cy.get('#login-button').click()

      cy.contains('mina logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('log in').click()
      cy.get('#username').type('lokki123')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.contains('wrong credentials')
    })
    describe('When logged in', function () {
      beforeEach(function () {
        cy.get('#username').type('lokki123')
        cy.get('#password').type('seppo123')
        cy.get('#login-button').click()

        cy.contains('mina logged in')
      })

      it('A blog can be created', function () {
        cy.contains('new blog').click()
        cy.get('#title-input').type('Testblog')
        cy.get('#author-input').type('lokki')
        cy.get('#url-input').type('www.google.fi')
        cy.get('#submit').click()

        cy.contains('Testblog')
      })
      describe('When logged in and created a blog', function () {
        beforeEach(function () {

          cy.contains('new blog').click()
          cy.get('#title-input').type('Testblog')
          cy.get('#author-input').type('lokki')
          cy.get('#url-input').type('www.google.fi')
          cy.get('#submit').click()

          cy.contains('Testblog')
        })
        it('A blog can be liked', function () {

          cy.contains('view').click()
          cy.get('#like').click()

          cy.contains('likes: 1')

        })

        it('A blog can be deleted', function () {
          cy.contains('view').click()
          cy.get('#remove').click()
          cy.wait(6000)
          cy.get('html').should('not.contain', 'Testblog')
        })
        it('Testing that a blog can be only deleted by person who created it', function () {
          cy.get('#logout').click()
          const user2 = {
            name: 'testuser',
            username: 'testi',
            password: 'testipassu'
          }
          cy.request('POST', 'http://localhost:3003/api/users/', user2)

          cy.get('#username').type('testi')
          cy.get('#password').type('testipassu')
          cy.get('#login-button').click()
          cy.contains('view').click()

          cy.get('html').should('not.contain', '#remove')
        })
        it('Testing that a blogs are in like order', function () {
          cy.get('#title-input').type('most hated blog')
          cy.get('#author-input').type('lokki')
          cy.get('#url-input').type('www.google.fi')
          cy.get('#submit').click()

          cy.contains('view').click()
          cy.get('#like').click()
          cy.get('.nimi').eq(0).should('contain', 'Testblog')
          cy.get('.nimi').eq(1).should('contain', 'most hated blog')

        })
      })
    })
  })
})