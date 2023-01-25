import { DeviceList } from 'styles'

export type SidebarWidth = {
  [key in keyof typeof DeviceList]?: number
}

export type Gap = {
  [key in keyof typeof DeviceList]?: number
} & {
  desktop: number
}

export const FilterSideMenu = {
  button: {
    desktop: {
      height: 54
    },
    mobile: {
      height: 54
    }
  },
  sideMenu: {
    desktop: {
      width: 112
    },
    mobile: {
      width: 112
    }
  }
}

export const RowCount = {
  desktopLarge: 5,
  desktopSmall: 4,
  tablet: 4
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
  desktopSmall: 320,
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

// @Todo: deal with this typing later
export const PartsCategories = [
  'cpu',
  'motherboard',
  'memory',
  'graphics',
  'ssd',
  'hdd',
  'case',
  'power',
  'cooler'
] as PartsCategoriesType[]
export type PartsCategoriesType =
  | 'cpu'
  | 'motherboard'
  | 'memory'
  | 'graphics'
  | 'ssd'
  | 'hdd'
  | 'case'
  | 'power'
  | 'cooler'

export const BuildPartsCategories = [
  'cpu',
  'motherboard',
  'memory',
  'graphics',
  'ssd',
  'hdd',
  'case',
  'power',
  'cpuCooler',
  'systemCooler',
  'reserved'
] as BuildPartsCategoriesType[]
export type BuildPartsCategoriesType =
  | 'cpu'
  | 'motherboard'
  | 'memory'
  | 'graphics'
  | 'ssd'
  | 'hdd'
  | 'case'
  | 'power'
  | 'cpuCooler'
  | 'systemCooler'
  | 'reserved'

export const ChangeFilterPopupDimension = {
  withTargetFilter: {
    default: {
      width: 420,
      height: 580
    }
  },
  withoutTargetFilter: {
    default: {
      width: 540,
      height: 720
    }
  }
}
