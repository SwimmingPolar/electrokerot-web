import { css, CSSObject } from 'styled-components'

const deviceList = {
  mobile: `(min-width: 0px) and (max-width: 480px)`,
  foldable: `(min-width: 481px) and (max-width: 743px)`,
  tablet: `(min-width: 744px)`,
  desktopSmall: `(min-width: 1200px)`,
  desktopLarge: `(min-width: 1400px)`
}

// @Issue: can't use template literal string inside mediaQuery at current implementation
const template =
  (device: keyof typeof deviceList) =>
  (styles: CSSObject | TemplateStringsArray) => {
    return `@media ${deviceList[device]} {
      ${css(styles)}
      }`
  }
const device =
  (...devices: (keyof typeof deviceList)[]) =>
  (styles: CSSObject | TemplateStringsArray) =>
    devices.map(device => template(device)(styles)).join('')

export type Media = {
  [key in keyof typeof deviceList]: ReturnType<typeof template>
}

export const mediaQuery = {
  mobile: template('mobile'),
  foldable: template('foldable'),
  tablet: template('tablet'),
  desktopSmall: template('desktopSmall'),
  desktopLarge: template('desktopLarge'),
  device
} as Media & { device: typeof device }
