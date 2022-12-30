import { DeviceList } from 'styles'

export type SidebarWidth = {
  [key in keyof typeof DeviceList]?: number
}

export type Gap = {
  [key in keyof typeof DeviceList]?: number
} & {
  desktop: number
}

export const Gap = {
  mobile: 0,
  foldable: 0,
  tablet: 7,
  desktop: 8
} as Gap

export const WelcomeSidebarWidth = {
  desktopSmall: 450,
  desktopLarge: 500
} as SidebarWidth

export const CategoryNavigationSidebarWidth = {
  mobile: 70,
  tablet: 96,
  desktopSmall: 64,
  desktopLarge: 200
} as SidebarWidth

export const BuildSummaryWidth = {
  desktopSmall: 280,
  desktopLarge: 420,
  // Build summary is not shown on mobile devices
  // but values are required for the padding to maintain the layout.
  // BuildSummary will be replaced with CategoryNavigation on mobile devices.
  // So, the width of CategoryNavigation is used.
  mobile: CategoryNavigationSidebarWidth.mobile,
  tablet: CategoryNavigationSidebarWidth.tablet
} as SidebarWidth

export const PartsCategoriesKr = {
  cpu: 'CPU',
  motherboard: '메인보드',
  memory: '메모리',
  graphics: '그래픽카드',
  ssd: 'SSD',
  hdd: 'HDD',
  power: '파워',
  case: '케이스',
  cooler: '쿨러'
}

const DefaultCategories = [
  'cpu',
  'motherboard',
  'memory',
  'graphics',
  'ssd',
  'hdd',
  'case',
  'power'
]

export type PartsCategoriesType = keyof typeof PartsCategoriesKr
export const PartsCategories = Object.keys(PartsCategoriesKr) as [
  PartsCategoriesType
]

export type BuildPartsCategoriesType =
  | Omit<PartsCategoriesType, 'cooler'>
  | 'cpuCooler'
  | 'systemCooler'

export const BuildPartsCategories = DefaultCategories.concat([
  'cpuCooler',
  'systemCooler'
]) as [BuildPartsCategoriesType]
