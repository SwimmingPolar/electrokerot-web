import { Build } from 'features'

export const build: Build = {
  _id: '63d0baa645ce35074d9ba241',
  owner: '63d0bab945ce35074d9ba242',
  name: 'Build #1',
  isSelected: true,
  parts: {
    cpu: {
      partId: '634e81a85f7f75147ef5ffc7',
      name: ' AMD 라이젠5-4세대 5600X (버미어) ',
      count: '1',
      price: '384,000원'
    },
    memory: {
      partId: '634e819e5f7f75147ef5f87b',
      name: '삼성전자 DDR4-3200',
      count: '2',
      price: '99,000원'
    },
    ssd: {
      partId: '634e81935f7f75147ef5efce',
      name: '삼성전자 PM9A1 M.2 NVMe 병행수입 ',
      count: '1',
      price: '33,000원'
    },
    hdd: {
      partId: '634e81ba5f7f75147ef6247d',
      name: 'Western Digital WD BLUE 5640/128M ',
      count: '1',
      price: '172,900원'
    },
    cpuCooler: {
      partId: '634e81cd5f7f75147ef65b3d',
      name: '맥스엘리트 MOTHRA 360 AIO ARGB',
      count: '1',
      price: '119,040원'
    },
    systemCooler: {
      partId: '634e81ce5f7f75147ef65d43',
      name: 'ARCTIC P12 PWM PST VALUE PACK 해외구매',
      count: '1',
      price: '91,080원'
    }
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}
