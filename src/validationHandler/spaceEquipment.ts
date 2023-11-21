import { validateEquipmentId } from './equipment.js';
import { validateSpaceId } from './space.js';

/* ---- SPACEEQUIPMENT ---- */

export const validateSpaceEquipmentPost = [
  ...validateSpaceId,
  ...validateEquipmentId,
];
