import { PageUrl } from 'constant'
import { DeviceType, getDeviceGroup } from 'hooks'

// Open signup page by manual navigation
export const openSignupPage = (device: Exclude<DeviceType, null>) => {
  cy.visit(PageUrl.parts)
  openMenu('로그인', device)
  cy.get(`a[href="${PageUrl.signup}"]`).click()

  // Assertions wait for the given assertion to pass
  // This is needed to wait for login page animation to finish and remove from the DOM
  cy.getBySel(PageUrl.login).should('not.exist')
}

// Checks if the url is correct after routing to new path
export const checkUrl = (url: string) => {
  cy.url().should('contain', url)
}

export function openMenu(menuName: string, device: Exclude<DeviceType, null>) {
  // Device with mobile menu: mobile
  if (device === 'mobile') {
    // Click hamburger menu
    cy.getBySel('mobile-menu').filter(':visible').click()

    // Click login menu
    cy.getBySel('mobile-menu-drawer').find('a').contains(menuName).click()
  }
  // Devices with desktop menu: desktopLarge, desktopSmall, tablet, foldable
  // foldable is treated as desktop when opening menu
  else {
    // Click the menu from the navbar above
    cy.getBySel('desktop-menu')
      .find('a')
      .filter(':visible')
      .contains(menuName)
      .click()
  }
}

export function closeModalPage(url: string, device: Exclude<DeviceType, null>) {
  const deviceGroup = getDeviceGroup(device)
  // Close the modal with appropriate method depending on the device
  if (deviceGroup === 'mobileFriendly') {
    cy.get('body').type('{esc}')
  } else {
    cy.getBySel(url).find('[data-cy="close-button"]').click()
  }
  // Wait until the page is closed
  cy.getBySel(url).should('not.exist')
}

// Go to signup page from login page
export const gotoSignupPage = (from: string) => {
  cy.getBySel(from).find(`a[href="${PageUrl.signup}"]`).click()
  // Assertions wait for the given assertion to pass.
  // This is needed to wait for page animation to finish
  // and previous page component remove from the DOM
  cy.getBySel(PageUrl.login).should('not.exist')
}

// Go to login page from signup page
export const gotoLoginPage = (
  from: string,
  device: Exclude<DeviceType, null>
) => {
  const deviceGroup = getDeviceGroup(device)
  if (deviceGroup === 'mobileFriendly') {
    // From mobile page, the only way to go to login page is to open the hamburger menu
    openMenu('로그인', 'mobile')
  } else {
    // From desktop page, there's back button to go to login page
    cy.getBySel(from).find(`a[href="${PageUrl.login}"]`).click()
  }
  // Assertions wait for the given assertion to pass
  // This is needed to wait for page animation to finish
  // and previous page component remove from the DOM
  cy.getBySel(PageUrl.signup).should('not.exist')
}
