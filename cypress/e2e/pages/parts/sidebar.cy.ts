import { withMedia } from '@cypress/hooks'
import { PageUrl } from 'constant'

describe('Show sidebar on desktop ', () => {
  withMedia(() => {
    cy.visit(PageUrl.parts)
    cy.getBySel('welcome-sidebar').should('be.visible')
  }, ['desktopLarge', 'desktopSmall'])
})

describe('Hide sidebar on mobile', () => {
  withMedia(() => {
    cy.visit(PageUrl.parts)
    cy.getBySel('welcome-sidebar').should('not.be.visible')
  }, ['mobile', 'foldable', 'tablet'])
})
