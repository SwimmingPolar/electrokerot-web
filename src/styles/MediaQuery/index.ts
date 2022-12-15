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
    return css(templateStringArray, ...interpolations)
  }

const device =
  (...devices: (keyof typeof DeviceList)[]) =>
  (first: First, ...interpolations: Interpolations) =>
    devices.map(device => template(device)(first, ...interpolations))

export type Media = {
  [key in keyof typeof DeviceList]: ReturnType<typeof template>
}

export const mediaQuery = {
  mobile: template('mobile'),
  foldable: template('foldable'),
  tablet: template('tablet'),
  desktopSmall: template('desktopSmall'),
  desktopLarge: template('desktopLarge'),
  desktop: device('desktopSmall', 'desktopLarge'),
  device
}
