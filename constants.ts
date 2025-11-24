import { RoomId, DeviceType, Room } from './types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: RoomId.LIVING_ROOM,
    name: "Phòng Khách",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80", // Modern bright living room
    temperature: 24,
    humidity: 45,
    devices: [
      { id: 'lr-light-1', name: "Đèn trần", type: DeviceType.LIGHT, isOn: false, value: 80, unit: '%' },
      { id: 'lr-ac-1', name: "Điều hòa", type: DeviceType.AC, isOn: true, value: 24, unit: '°C' },
      { id: 'lr-tv-1', name: "Smart TV", type: DeviceType.TV, isOn: false },
      { id: 'lr-robot-1', name: "Robot Lau Nhà", type: DeviceType.ROBOT_VACUUM, isOn: false },
      { id: 'lr-lock-1', name: "Cửa Chính", type: DeviceType.LOCK, isOn: true }, // isOn=True means Locked
    ]
  },
  {
    id: RoomId.KITCHEN,
    name: "Nhà Bếp",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80", // Bright modern kitchen
    temperature: 26,
    humidity: 50,
    devices: [
      { id: 'k-light-1', name: "Đèn bếp", type: DeviceType.LIGHT, isOn: false, value: 100, unit: '%' },
      { id: 'k-cooker-1', name: "Nồi Cơm Điện", type: DeviceType.RICE_COOKER, isOn: false },
      { id: 'k-fan-1', name: "Quạt thông gió", type: DeviceType.FAN, isOn: false },
    ]
  },
  {
    id: RoomId.BEDROOM,
    name: "Phòng Ngủ",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80", // Changed to a valid bright bedroom
    temperature: 22,
    humidity: 40,
    devices: [
      { id: 'br-light-1', name: "Đèn ngủ", type: DeviceType.LIGHT, isOn: false, value: 30, unit: '%' },
      { id: 'br-ac-1', name: "Điều hòa", type: DeviceType.AC, isOn: false, value: 25, unit: '°C' },
      { id: 'br-curtain-1', name: "Rèm cửa", type: DeviceType.CURTAIN, isOn: false }, // isOn=True means Open
    ]
  },
  {
    id: RoomId.GARDEN,
    name: "Sân Vườn",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80", // Sunny garden
    temperature: 28,
    humidity: 60,
    devices: [
      { id: 'g-light-1', name: "Đèn sân vườn", type: DeviceType.LIGHT, isOn: false },
      { id: 'g-sprinkler-1', name: "Vòi phun nước", type: DeviceType.SPRINKLER, isOn: false },
    ]
  }
];

export const MOCK_ENERGY_DATA = [
  { time: '00:00', usage: 1.2 },
  { time: '04:00', usage: 0.8 },
  { time: '08:00', usage: 3.5 },
  { time: '12:00', usage: 4.2 },
  { time: '16:00', usage: 3.8 },
  { time: '20:00', usage: 5.5 },
  { time: '23:59', usage: 2.1 },
];

export const SUGGESTED_COMMANDS = [
  {
    category: "Phòng Khách",
    commands: [
      "Bật đèn trần phòng khách",
      "Khóa cửa chính lại",
      "Cho robot lau nhà đi",
      "Bật điều hòa phòng khách 24 độ"
    ]
  },
  {
    category: "Nhà Bếp",
    commands: [
      "Nấu cơm đi",
      "Bật đèn bếp",
      "Bật quạt thông gió bếp"
    ]
  },
  {
    category: "Phòng Ngủ",
    commands: [
      "Mở rèm phòng ngủ ra",
      "Tắt đèn ngủ",
      "Đặt điều hòa phòng ngủ 26 độ"
    ]
  },
  {
    category: "Sân Vườn",
    commands: [
      "Bật đèn sân vườn",
      "Bật vòi phun nước"
    ]
  }
];