import { DeviceDetectContextProvider } from 'hooks'

type DeviceProviderType = {
  children: JSX.Element
}

export const DeviceProvider = ({ children }: DeviceProviderType) => {
  return <DeviceDetectContextProvider>{children}</DeviceDetectContextProvider>
}
