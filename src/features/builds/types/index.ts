import { BuildPartsCategoriesType } from 'constant'
import { MarketType } from 'features'

// Type for the build
export type Build = {
  _id: string
  owner: string
  name: string
  isSelected: boolean
  parts: BuildParts
  optimization?: BuildOptimization
  createdAt: string
  updatedAt: string
}

export type BuildParts = {
  [key in BuildPartsCategoriesType]?: BuildPart
}

// Type for the individual part in the build
export type BuildPart = {
  partId: string
  name: string
  count: string
  price: string
  filters?: BuildFilter[]
}

export type BuildFilter = {
  marketType: MarketType
  vendorUrl: string
  status: BuildFilterStatus
}

export type BuildFilterStatus = 'included' | 'excluded' | 'selected'

export type BuildOptimization = {
  hash: string
  optimizedAt: string
  lowestPrice: Record<BuildPartsCategoriesType, OptimizedPart>
  leastPackage: Record<BuildPartsCategoriesType, OptimizedPart>
}

export type OptimizedPart = {
  marketType: MarketType
  vendorUrl: string
}

export type BuildSummaryCardPartsCategoriesType =
  | 'cpu'
  | 'motherboard'
  | 'memory'
  | 'graphics'
  | 'storage'
  | 'case'
  | 'power'
  | 'cooler'
  | 'reserved'
