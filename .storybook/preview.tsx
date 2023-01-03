import { withProvider, withTheme } from '../src/lib'

export const decorators = [withProvider, withTheme]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  viewport: {
    viewports: {
      mobile: {
        name: 'Mobile',
        styles: {
          width: '414px',
          height: '896px'
        }
      },
      foldable: {
        name: 'Foldable',
        styles: {
          width: '717px',
          height: '512px'
        }
      },
      tablet: {
        name: 'Tablet',
        styles: {
          width: '1199px',
          height: '1024px'
        }
      },
      desktopSmall: {
        name: 'Desktop Small',
        styles: {
          width: '1200px',
          height: '1080px'
        }
      },
      desktopLarge: {
        name: 'Desktop Large',
        styles: {
          width: '1400px',
          height: '1080px'
        }
      }
    }
  }
}
