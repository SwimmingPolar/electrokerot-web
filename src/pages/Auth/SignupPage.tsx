import { ModalLayout } from 'components'
import { Signup } from 'features'
import { FC } from 'react'

export const SignupPage: FC = () => {
  return <ModalLayout modal={Signup} pathname="/signup" />
}
