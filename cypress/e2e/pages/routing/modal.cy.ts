// Test navigation between modal pages

import {
  checkUrl,
  closeModalPage,
  gotoLoginPage,
  gotoSignupPage,
  openMenu,
  openSignupPage,
  withMedia
} from '@cypress/hooks'
import { PageUrl } from 'constant'

describe('Go to login page by clicking the back button', () => {
  withMedia(
    ({ device }) => {
      openSignupPage(device)

      cy.getBySel('/signup').find('a[href="/login"]').click()

      cy.url().should('contain', '/login')
    },
    ['desktopLarge', 'desktopSmall', 'tablet']
  )
})

describe('Go to login page by clicking the browser back button', () => {
  withMedia(
    ({ device }) => {
      openSignupPage(device)

      cy.go('back')

      cy.url().should('contain', '/login')
    },
    ['mobile', 'foldable']
  )
})

describe('Go to login page from signup page using menu from the above navbar', () => {
  withMedia(
    ({ device }) => {
      openSignupPage(device)

      openMenu('로그인', device)

      cy.url().should('contain', '/login')
    },
    ['foldable']
  )
})

describe('Go to login page from signup page using hamburger menu', () => {
  withMedia(
    ({ device }) => {
      openSignupPage(device)

      openMenu('로그인', device)

      cy.url().should('contain', '/login')
    },
    ['mobile']
  )
})

/**
 * @Reference: useDecideNavigationMethod.tsx
 * Below are tests for various navigation behaviors under different conditions
 */

describe('Modal open within app', () => {
  // ----------------------------------------------
  // user navigation:        / -> /login -> /
  //                              back(-1)
  // actual router history:  / -> /login
  //                       current
  // ----------------------------------------------
  describe('/ -> /login -> /', () => {
    withMedia(
      ({ device }) => {
        cy.visit(PageUrl.parts)

        // Go to login page
        openMenu('로그인', device)

        // Close the login page
        closeModalPage('/login', device)

        // Make sure it's back to where it was
        checkUrl(PageUrl.parts)

        // Go forward to check the history is properly recorded
        cy.go(1)
        checkUrl(PageUrl.login)
      },

      ['desktopLarge', 'desktopSmall', 'tablet']
    )
  })

  // ----------------------------------------------
  // user navigation:        / -> /login -> /signup -> /
  //                                    back(-2)
  // actual router history:  / -> /login -> /signup
  //                       current
  // ----------------------------------------------
  describe('/ -> /login -> /signup -> /', () => {
    withMedia(
      ({ device }) => {
        cy.visit(PageUrl.parts)

        // Go to login page
        openMenu('로그인', device)

        // Go to signup page
        gotoSignupPage(PageUrl.login)

        // Close the signup page
        closeModalPage(PageUrl.signup, device)

        // Make sure it's back to where it was
        checkUrl(PageUrl.parts)

        // Go forward to check the history is properly recorded
        cy.go(2)
        checkUrl(PageUrl.signup)
      },
      ['desktopLarge', 'desktopSmall', 'tablet']
    )
  })

  // ----------------------------------------------
  // user navigation:        / -> /login -> /signup -> /login -> /
  //                                        back(-1)
  // actual router history:  / -> /login -> /signup
  //                     current
  // ----------------------------------------------
  describe('/ -> /login -> /signup -> /login -> /', () => {
    withMedia(
      ({ device }) => {
        cy.visit(PageUrl.parts)

        // Go to login page
        openMenu('로그인', device)

        // Go to signup page
        gotoSignupPage(PageUrl.login)

        // Go to login page again
        gotoLoginPage(PageUrl.signup, device)

        // Close the login page
        closeModalPage(PageUrl.login, device)

        // Make sure it's back to where it was
        checkUrl(PageUrl.parts)

        // Go forward to check the history is properly recorded
        cy.go(2)
        checkUrl(PageUrl.signup)
      },
      ['desktopLarge', 'desktopSmall', 'tablet']
    )
  })
})
describe('Modal open directly via url', () => {
  // ----------------------------------------------
  // user navigation:        /login -> /signup -> /
  //                                   replace
  // actual router history:  /login -> /
  //                                current
  // ----------------------------------------------
  describe('/login -> /signup -> /', () => {
    withMedia(
      ({ device }) => {
        cy.visit(PageUrl.login)

        // Go to signup page
        gotoSignupPage(PageUrl.login)

        // Close the signup page
        closeModalPage(PageUrl.signup, device)

        // Make sure it's back to where it was
        checkUrl(PageUrl.parts)

        // Go forward to check the history is properly recorded
        cy.go(-1)
        checkUrl(PageUrl.login)
      },
      ['desktopLarge', 'desktopSmall', 'tablet']
    )
  })
  // ----------------------------------------------
  // user navigation:        /login -> /signup -> /login -> /
  //                           BACK and FORTH by NavLink component
  // actual router history:  /login -> /
  //                                current
  // ----------------------------------------------
  describe('/login -> /signup -> /login -> /', () => {
    withMedia(
      ({ device }) => {
        cy.visit(PageUrl.login)

        // Go to signup page
        gotoSignupPage(PageUrl.login)

        // Go to login page again
        gotoLoginPage(PageUrl.signup, device)

        // Close the login page
        closeModalPage(PageUrl.login, device)

        // Make sure it's back to where it was
        checkUrl(PageUrl.parts)

        // Go backward to check the history is properly recorded
        cy.go('back')
        checkUrl(PageUrl.login)

        // Going 999 times back should be the same as going to the root
        cy.go(-999)
        checkUrl(PageUrl.login)
      },
      ['desktopLarge', 'desktopSmall', 'tablet']
    )
  })
  // ----------------------------------------------
  // user navigation:        /login -> /
  // actual router history:  /login -> /
  //                                current
  // ----------------------------------------------
  describe('/login -> /', () => {
    withMedia(
      ({ device }) => {
        cy.visit(PageUrl.login)

        // Close the login page
        closeModalPage(PageUrl.login, device)

        // Make sure it's back to where it was
        checkUrl(PageUrl.parts)

        // Go forward to check the history is properly recorded
        cy.go('back')
        checkUrl(PageUrl.login)

        // Going 999 times back should be the same as going to the root
        cy.go(-999)
        checkUrl(PageUrl.login)
      },
      ['desktopLarge', 'desktopSmall', 'tablet']
    )
  })
  // ----------------------------------------------
  // user navigation:        /signup -> /
  // actual router history:  /
  //                      current
  // ----------------------------------------------
  describe('/signup -> /', () => {
    withMedia(
      ({ device }) => {
        cy.visit(PageUrl.signup)

        // Close the signup page
        closeModalPage(PageUrl.signup, device)

        // Make sure it's back to where it was
        checkUrl(PageUrl.parts)

        // Going 999 times back should be the same as going to the root
        cy.go(-999)
        checkUrl(PageUrl.parts)
      },
      ['desktopLarge', 'desktopSmall', 'tablet']
    )
  })
  // ----------------------------------------------
  // user navigation:        /signup -> /login -> /signup -> /
  // actual router history:  /login -> /
  //                               current
  // ----------------------------------------------
  describe('/signup -> /login -> /signup -> /', () => {
    withMedia(
      ({ device }) => {
        cy.visit(PageUrl.signup)

        // Go to login page
        gotoLoginPage(PageUrl.signup, device)

        // Go to signup page
        gotoSignupPage(PageUrl.login)

        // Close the signup page
        closeModalPage(PageUrl.signup, device)

        // Make sure it's back to where it was
        checkUrl(PageUrl.parts)

        // Go forward to check the history is properly recorded
        cy.go(-1)
        checkUrl(PageUrl.login)

        // Going 999 times back should be the same as going to the root
        cy.go(-999)
        checkUrl(PageUrl.login)
      },
      ['desktopLarge', 'desktopSmall', 'tablet']
    )
  })
})

describe('Modal navigation for mobile', () => {
  // ----------------------------------------------
  // user navigation:        / -> /login -> /signup -> /
  // actual router history:  / -> /login -> /signup -> /
  // ----------------------------------------------
  describe('/ -> /login -> /signup -> /', () => {
    withMedia(
      ({ device }) => {
        cy.visit(PageUrl.parts)

        // Go to login page
        openMenu('로그인', device)

        // Go to signup page
        gotoSignupPage(PageUrl.login)

        // Close the signup page
        closeModalPage(PageUrl.signup, device)

        // Make sure it's back to where it was
        checkUrl(PageUrl.parts)

        // Follow the history up to the root and check it's recorded properly
        cy.go(-1)
        checkUrl(PageUrl.signup)
        cy.go(-1)
        checkUrl(PageUrl.login)
        cy.go(-1)
        checkUrl(PageUrl.parts)
      },
      ['mobile']
    )
  })
  // ----------------------------------------------
  // user navigation:        /login -> /
  // actual router history:  /login -> /
  // ----------------------------------------------
  describe('/login -> /', () => {
    withMedia(
      ({ device }) => {
        cy.visit(PageUrl.login)
        cy.getBySel(PageUrl.login).contains('로그인')

        // Close the login page
        closeModalPage(PageUrl.login, device)

        // Make sure it's back to where it was
        checkUrl(PageUrl.parts)

        // Follow the history up to the root and check it's recorded properly
        cy.go(-1)
        checkUrl(PageUrl.login)

        cy.go(-999)
        checkUrl(PageUrl.login)
      },
      ['mobile']
    )
  })
  // ----------------------------------------------
  // user navigation:        /signup -> /login -> /
  // actual router history:  /signup -> /login -> /
  // ----------------------------------------------
  describe('/signup -> /login -> /', () => {
    withMedia(
      ({ device }) => {
        cy.visit(PageUrl.signup)
        cy.getBySel(PageUrl.signup).contains('회원가입')

        // Go to login page
        gotoLoginPage(PageUrl.signup, device)

        // Close the login page
        closeModalPage(PageUrl.login, device)

        // Make sure it's back to where it was
        checkUrl(PageUrl.parts)

        // Follow the history up to the root and check it's recorded properly
        cy.go(-1)
        checkUrl(PageUrl.login)
        cy.go(-1)
        checkUrl(PageUrl.signup)
        cy.go(-999)
        checkUrl(PageUrl.signup)
      },
      ['mobile']
    )
  })
})
