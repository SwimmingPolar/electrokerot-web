import { withMedia, openMenu } from '@cypress/hooks'
import { PageUrl } from 'constant'

describe('Open login page modal', () => {
  withMedia(({ device, deviceGroup }) => {
    cy.visit(PageUrl.parts)
    openMenu('로그인', device)

    if (deviceGroup === 'desktopFriendly') {
      // When the modal is open from desktop, the backdrop is visible
      cy.getBySel('modal-backdrop').should('have.css', 'display', 'flex')
    } else {
      // When the modal is open from desktop, the backdrop is not visible
      cy.getBySel('modal-backdrop').should('have.css', 'display', 'none')
    }

    cy.url().should('contain', '/login')
  })
})

describe('Close login page modal', () => {
  beforeEach(() => {
    cy.visit(PageUrl.parts)
  })

  describe('With close button click', () => {
    withMedia(
      ({ device }) => {
        openMenu('로그인', device)

        // Close the modal by clicking the close button
        cy.getBySel('close-button').click()

        // Make sure the page is back to where it was
        cy.url().should('contain', '/parts')
      },
      ['desktopLarge', 'desktopSmall', 'tablet']
    )
  })

  describe('With escape key down', () => {
    withMedia(({ device }) => {
      openMenu('로그인', device)

      cy.get('body').type('{esc}')

      cy.url().should('contain', '/parts')
    })
  })
})
