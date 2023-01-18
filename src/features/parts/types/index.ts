import { PartsCategoriesType } from 'constant'

export type Details = Record<
  string,
  {
    value: string
    type: string
  }
>

export type Vendor = {
  vendorName: string
  vendorCode?: string
  vendorUrl: string
  shippingCost: number
  price: number
}

export type MarketType = 'openMarket' | 'mall' | 'credit' | 'cash'

export type Vendors = Record<MarketType, Vendor>

export type Price = {
  timestamp: Date
  price: number
}

export type Part = {
  _id: string
  name: {
    fullName: string
    tag?: string
  }
  category: PartsCategoriesType
  variants: Part[]
  sortOrder: number
  stock: boolean
  details: Details
  vendors: Vendors
  prices: Price[]
  updatedAt: Date
}
