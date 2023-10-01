export type RoleName = 'admin' | 'planner' | 'statist';

export type RolePropertyName = 'isAdmin' | 'isPlanner' | 'isStatist';

export type RoleRequired =
  | 0 // none required
  | -1 // at least one required
  | 1; // role needs to be satisfied

export type User = {
  [key in RolePropertyName]: RoleRequired;
};

export interface Program {
  id: number;
  name: string;
}

export interface ProgramAllocation extends Program {
  rooms: AllocatedRoomsByProgramType;
  subjects: AllocatedSubjectsByProgramType;
}

export interface AllocatedSubjectsByProgramType extends Program {
  allocatedHours: number;
  requiredHours: number;
}

export interface AllocatedRoomsByProgramType extends Program {
  allocatedhours: number;
}
