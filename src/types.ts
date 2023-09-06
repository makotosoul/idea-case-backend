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
