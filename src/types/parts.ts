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
} as {
  [key: string]: string
}

export const PartsCategories = [...DefaultCategories, 'cooler']
export const BuildPartsCategories = [
  ...DefaultCategories,
  'cpuCooler',
  'systemCooler'
]
