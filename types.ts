export enum RoomId {
  STAGE = 'CAM 1A',
  DINING = 'CAM 1B',
  PIRATE_COVE = 'CAM 1C',
  WEST_HALL = 'CAM 2A',
  WEST_HALL_CORNER = 'CAM 2B',
  EAST_HALL = 'CAM 4A',
  EAST_HALL_CORNER = 'CAM 4B',
  BACKSTAGE = 'CAM 5',
  KITCHEN = 'CAM 6',
  RESTROOMS = 'CAM 7',
  OFFICE = 'OFFICE' // Not a camera, but a location
}

export enum AnimatronicName {
  FREDDY = 'Freddy',
  BONNIE = 'Bonnie',
  CHICA = 'Chica',
  FOXY = 'Foxy'
}

export interface Animatronic {
  name: AnimatronicName;
  currentLocation: RoomId;
  aggressionLevel: number; // 1-20
  movementOpportunity: number; // Decrements over time, when 0, try move
}

export interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  isVictory: boolean;
  hour: number; // 12, 1, 2, 3, 4, 5, 6
  power: number; // 0-100
  usage: number; // 1-5 bars
  camerasOpen: boolean;
  currentCamera: RoomId;
  leftDoorClosed: boolean;
  rightDoorClosed: boolean;
  leftLightOn: boolean;
  rightLightOn: boolean;
  animatronics: Animatronic[];
  jumpscare: AnimatronicName | null;
  phoneMessage: string | null;
}

export const INITIAL_POWER = 100;
export const POWER_DRAIN_RATE_MS = 3000; // Base drain tick
export const HOUR_LENGTH_MS = 45000; // 45 seconds per hour -> ~4.5 min game
