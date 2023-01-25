import { PartsCategoriesType } from 'constant'

export type Part = {
  _id: string
  name: {
    fullName: string
    tag?: string
  }
  category: PartsCategoriesType
  variants: string[]
  sortOrder: number
  stock: boolean
  details: Details
  vendors: Vendors
  prices: Price[]
  updatedAt: string
}

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
  url: string
  price: string
  shippingCost: string
  card?: string
}

export type MarketType = 'openMarket' | 'mall' | 'credit' | 'cash'

export type Vendors = Record<MarketType, Vendor[]>

export type Price = {
  timestamp: string
  value: string
}
