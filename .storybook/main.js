const { mergeConfig } = require('vite')
const viteTsconfig = require('vite-tsconfig-paths')
const tsconfigPaths = viteTsconfig.default

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-actions',
    '@storybook/addon-interactions',
    '@storybook/addon-essentials'
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite'
  },
  features: {
    storyStoreV7: true
  },
  // storybook absolute path
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tsconfigPaths()]
    })
  }
}
