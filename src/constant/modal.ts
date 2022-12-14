import { TransitionDuration } from 'styles'

export const PageUrl = {
  parts: '/parts',
  login: '/login',
  signup: '/signup',
  findPassword: '/findPassword'
}

export const ModalPageOrders = {
  '/login': 1,
  '/signup': 2,
  '/findPassword': 2
} as {
  [key: string]: number
}

export type ModalRoutesType = '/login' | '/signup' | '/findPassword'
export const ModalRoutes = Object.keys(ModalPageOrders)

export const ModalClassName = '.modal-page-layout'
export const ModalAnimationDuration = TransitionDuration * 1000
