import Header from './Header'

describe('Header', () => {
  it('should render', () => {
    cy.mount(<Header />)
    cy.get('h1').should('contain', 'hello world!')
  })
})
