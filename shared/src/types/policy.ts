export interface Policy {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePolicyDto {
  name: string;
  description?: string;
}
