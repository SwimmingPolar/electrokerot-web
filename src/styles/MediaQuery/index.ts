import { css } from 'styled-components'

const DeviceList = {
  mobile: `(min-width: 0px) and (max-width: 743px)`,
  foldable: `(min-width: 481px) and (max-width: 743px)`,
  tablet: `(min-width: 744px) and (max-width: 1199px)`,
  desktopSmall: `(min-width: 1200px) and (max-width: 1399px)`,
  desktopLarge: `(min-width: 1400px)`
}

type First = Parameters<typeof css>[0]
type Interpolations = Parameters<typeof css>[1][]

const concatMediaQuery = (first: First, device: keyof typeof DeviceList) => {
  if (!Array.isArray(first)) {
    return first
  }

  const styledString = Array.from(first)
  const mediaQuery = `@media ${DeviceList[device]} {`

  // concat media query to the head and the end of template string
  styledString[0] = mediaQuery + styledString[0]
  styledString[styledString.length - 1] =
    styledString[styledString.length - 1] + '}'

  return styledString
}

const template =
  (device: keyof typeof DeviceList) =>
  (first: First, ...interpolations: Interpolations) => {
    const templateStringArray = concatMediaQuery(first, device) as First
    console.log(css(templateStringArray, ...interpolations))
    return css(templateStringArray, ...interpolations)
  }

/**
 * @param devices list of device names (mobile, foldable, tablet, desktopSmall, desktopLarge)
 * @returns a function that takes a template string and returns a media query
 * @description follow the function declaration for the usage
 */
// Usage:
// device('mobile', 'tablet')`
//  color: red;
//  background-color: ${props => props.theme.colors.primary}
// `
const device =
  (...devices: (keyof typeof DeviceList)[]) =>
  (first: First, ...interpolations: Interpolations) =>
    devices.map(device => template(device)(first, ...interpolations))

export type Media = {
  [key in keyof typeof DeviceList]: ReturnType<typeof template>
}

// Usage:
// media.mobile`
//  color: red;
//  background-color: ${props => props.theme.colors.primary}
// `
export const mediaQuery = {
  /** @description follow the function declaration for the usage */
  mobile: template('mobile'),
  /** @description follow the function declaration for the usage */
  foldable: template('foldable'),
  /** @description follow the function declaration for the usage */
  tablet: template('tablet'),
  /** @description follow the function declaration for the usage */
  desktopSmall: template('desktopSmall'),
  /** @description follow the function declaration for the usage */
  desktopLarge: template('desktopLarge'),
  /** @description follow the function declaration for the usage */
  desktop: device('desktopSmall', 'desktopLarge'),
  /** @description follow the function declaration for the usage */
  device
}
