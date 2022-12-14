import { openSignupPage, withMedia } from '@cypress/hooks'
import { PageUrl } from 'constant'

describe('Open signup page modal', () => {
  withMedia(({ device, deviceGroup }) => {
    openSignupPage(device)

    if (deviceGroup === 'desktopFriendly') {
      // When the modal is open from desktop, the backdrop is visible
      cy.getBySel('modal-backdrop').should('have.css', 'display', 'flex')
    } else {
      // When the modal is open from desktop, the backdrop is not visible
      cy.getBySel('modal-backdrop').should('have.css', 'display', 'none')
    }

    cy.url().should('contain', '/signup')
  })
})

describe('Close signup page modal', () => {
  beforeEach(() => {
    cy.visit(PageUrl.parts)
  })

  describe('With close button click', () => {
    withMedia(
      ({ device }) => {
        openSignupPage(device)

        // Close the modal by clicking the close button
        // Make sure to properly target the close button, not the one in the login page
        cy.getBySel('/signup').find('[data-cy="close-button"]').click()

        // Make sure the page is back to where it was
        cy.url().should('contain', '/parts')
      },
      ['desktopLarge', 'desktopSmall', 'tablet']
    )
  })

  describe('With escape key down', () => {
    withMedia(({ device }) => {
      openSignupPage(device)

      cy.get('body').type('{esc}')

      cy.url().should('contain', '/parts')
    })
  })
})
