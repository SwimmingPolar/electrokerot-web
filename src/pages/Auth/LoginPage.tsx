import { ModalLayout } from 'components'
import { Login } from 'features'
import { FC } from 'react'

export const LoginPage: FC = () => {
  return <ModalLayout modal={Login} pathname="/login" />
}
