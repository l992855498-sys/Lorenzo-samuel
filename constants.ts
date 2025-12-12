import { RoomId, AnimatronicName } from './types';

export const ADJACENCY_MAP: Record<RoomId, RoomId[]> = {
  [RoomId.STAGE]: [RoomId.DINING],
  [RoomId.DINING]: [RoomId.BACKSTAGE, RoomId.WEST_HALL, RoomId.EAST_HALL, RoomId.RESTROOMS, RoomId.KITCHEN],
  [RoomId.PIRATE_COVE]: [RoomId.WEST_HALL],
  [RoomId.BACKSTAGE]: [RoomId.DINING],
  [RoomId.RESTROOMS]: [RoomId.DINING],
  [RoomId.KITCHEN]: [RoomId.DINING], // Audio only room usually
  [RoomId.WEST_HALL]: [RoomId.DINING, RoomId.WEST_HALL_CORNER, RoomId.PIRATE_COVE],
  [RoomId.WEST_HALL_CORNER]: [RoomId.WEST_HALL, RoomId.OFFICE],
  [RoomId.EAST_HALL]: [RoomId.DINING, RoomId.EAST_HALL_CORNER],
  [RoomId.EAST_HALL_CORNER]: [RoomId.EAST_HALL, RoomId.OFFICE],
  [RoomId.OFFICE]: [RoomId.WEST_HALL_CORNER, RoomId.EAST_HALL_CORNER] // Logic only
};

// Initial setup for Night 1
export const INITIAL_ANIMATRONICS = [
  {
    name: AnimatronicName.BONNIE,
    currentLocation: RoomId.STAGE,
    aggressionLevel: 3,
    movementOpportunity: 50
  },
  {
    name: AnimatronicName.CHICA,
    currentLocation: RoomId.STAGE,
    aggressionLevel: 3,
    movementOpportunity: 55
  },
  {
    name: AnimatronicName.FREDDY,
    currentLocation: RoomId.STAGE,
    aggressionLevel: 1, // Freddy is slow on Night 1
    movementOpportunity: 100
  },
  {
    name: AnimatronicName.FOXY,
    currentLocation: RoomId.PIRATE_COVE,
    aggressionLevel: 2,
    movementOpportunity: 80
  }
];

export const CAM_NAMES: {id: RoomId, label: string, gridPos: string}[] = [
  { id: RoomId.STAGE, label: 'Show Stage', gridPos: 'col-start-2 row-start-1' },
  { id: RoomId.DINING, label: 'Dining Area', gridPos: 'col-start-2 row-start-2' },
  { id: RoomId.PIRATE_COVE, label: 'Pirate Cove', gridPos: 'col-start-1 row-start-2' },
  { id: RoomId.BACKSTAGE, label: 'Backstage', gridPos: 'col-start-1 row-start-1' },
  { id: RoomId.WEST_HALL, label: 'W. Hall', gridPos: 'col-start-1 row-start-3' },
  { id: RoomId.WEST_HALL_CORNER, label: 'W. Hall Corner', gridPos: 'col-start-1 row-start-4' },
  { id: RoomId.RESTROOMS, label: 'Restrooms', gridPos: 'col-start-3 row-start-1' },
  { id: RoomId.KITCHEN, label: 'Kitchen', gridPos: 'col-start-3 row-start-2' },
  { id: RoomId.EAST_HALL, label: 'E. Hall', gridPos: 'col-start-3 row-start-3' },
  { id: RoomId.EAST_HALL_CORNER, label: 'E. Hall Corner', gridPos: 'col-start-3 row-start-4' },
];
