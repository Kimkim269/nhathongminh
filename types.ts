export enum RoomId {
  LIVING_ROOM = 'living_room',
  KITCHEN = 'kitchen',
  BEDROOM = 'bedroom',
  GARDEN = 'garden'
}

export enum DeviceType {
  LIGHT = 'light',
  FAN = 'fan',
  AC = 'ac',
  TV = 'tv',
  LOCK = 'lock',
  SPRINKLER = 'sprinkler',
  CURTAIN = 'curtain',
  RICE_COOKER = 'rice_cooker',
  ROBOT_VACUUM = 'robot_vacuum'
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  isOn: boolean;
  value?: number; // For temperature or brightness (0-100)
  unit?: string;
}

export interface Room {
  id: RoomId;
  name: string;
  image: string;
  devices: Device[];
  temperature: number;
  humidity: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

export interface EnergyData {
  time: string;
  usage: number; // kWh
}