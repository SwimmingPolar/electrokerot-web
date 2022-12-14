import { withMedia } from '@cypress/hooks'
import { PageUrl } from 'constant'

describe('Show desktop menu on desktop ', () => {
  withMedia(() => {
    cy.visit(PageUrl.parts)
    cy.getBySel('desktop-menu').should('be.visible')
  }, ['desktopLarge', 'desktopSmall', 'foldable', 'tablet'])
})

describe('Hide desktop menu on mobile', () => {
  withMedia(() => {
    cy.visit(PageUrl.parts)
    cy.getBySel('desktop-menu').should('not.exist')
  }, ['mobile'])
})

describe('Show mobile menu on mobile ', () => {
  withMedia(() => {
    cy.visit(PageUrl.parts)
    cy.getBySel('mobile-menu').should('be.visible')
  }, ['mobile'])
})

describe('Hide mobile menu on desktop', () => {
  withMedia(() => {
    cy.visit(PageUrl.parts)
    cy.getBySel('mobile-menu').should('not.exist')
  }, ['desktopLarge', 'desktopSmall', 'foldable', 'tablet'])
})
