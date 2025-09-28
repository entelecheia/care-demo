export type SimulationStatus = "pending" | "running" | "completed" | "failed";

export interface Simulation {
  id: string;
  name: string;
  description?: string;
  status: SimulationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSimulationDto {
  name: string;
  description?: string;
}
