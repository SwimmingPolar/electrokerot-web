import { DeviceType, DeviceGroup, Viewports, getDeviceGroup } from 'hooks'

type TestParams = {
  device: Exclude<DeviceType, null>
  deviceGroup: DeviceGroup
}
type Test = (params: TestParams) => void

export function withMedia(test: Test, devices?: Array<DeviceType>) {
  // Copy Viewports to avoid mutating it
  const viewports = Object.assign({}, Viewports)

  // If 'devices' is not provided, run test against all devices
  devices = (
    devices && devices?.length !== 0 ? devices : Object.keys(Viewports)
  ) as Array<DeviceType>

  devices.forEach(device => {
    if (!device) {
      return
    }

    // Type force casting: 'deviceGroup' will never be undefined even though it returns undefined when nothing matched
    const deviceGroup = getDeviceGroup(device) as DeviceGroup

    it(`${device}: `, () => {
      // Change the viewport size to the device's size
      cy.viewport(viewports[device].width, viewports[device].height)

      // Run test under the device's viewport
      test({
        device,
        deviceGroup
      })
    })
  })
}
