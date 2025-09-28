export interface Community {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommunityDto {
  name: string;
  description?: string;
}
