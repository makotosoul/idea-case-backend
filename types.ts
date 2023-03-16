export interface Program {
    id: number;
    name: string;
}

export interface ProgramAllocation extends Program{
    rooms: AllocatedRoomsByProgramType,
    subjects: AllocatedSubjectsByProgramType,
};

export interface AllocatedSubjectsByProgramType {
    id: number,
    name: string,
    allocatedHours: number,
    requiredHours: number,
}

export interface AllocatedRoomsByProgramType {
    id: number,
    name: string,
    allocatedhours: number,
  }