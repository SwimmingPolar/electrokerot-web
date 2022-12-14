import { withMedia } from '@cypress/hooks'
import { navbarProps } from 'components/Navbar'
import { PageUrl } from 'constant'

describe('Show hamburger menu and menu list', () => {
  withMedia(() => {
    cy.visit(PageUrl.parts)
    cy.getBySel('mobile-menu').click()

    cy.getBySel('mobile-menu-drawer').should('be.visible')

    cy.getBySel('mobile-menu-drawer').find('a').should('have.length', 3)

    // Copy the menuList array to avoid mutating the original array
    const menuList = [...navbarProps.menuList]

    // Check all the menu items are present
    menuList.forEach(({ menu }) => {
      cy.getBySel('mobile-menu-drawer').find('a').contains(menu)
    })
  }, ['mobile'])
})

describe('Close menu drawer on backdrop click', () => {
  withMedia(() => {
    cy.visit(PageUrl.parts)
    cy.getBySel('mobile-menu').click()

    cy.getBySel('mobile-menu-drawer').should('be.visible')

    // MUI drawer's backdrop class name can be changed in the future
    cy.get('.MuiBackdrop-root').click()

    cy.getBySel('mobile-menu-drawer').should('not.exist')
  }, ['mobile'])
})

describe('Close menu drawer with escape key', () => {
  withMedia(() => {
    cy.visit(PageUrl.parts)
    cy.getBySel('mobile-menu').click()

    cy.getBySel('mobile-menu-drawer').should('be.visible')

    cy.get('body').type('{esc}')

    cy.getBySel('mobile-menu-drawer').should('not.exist')
  }, ['mobile'])
})
