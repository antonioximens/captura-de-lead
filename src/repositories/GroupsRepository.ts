import { Group } from "@prisma/client";

export interface CreateGroupAttributes {
  name: string;
  description: string;
}

export interface GroupsRepository {
  find: () => Promise<Group[]>;
  findById: (id: number) => Promise<Group | null>;
  create: (attributes: CreateGroupAttributes) => Promise<Group>;
  updateById: (id: number, attributes: Partial<CreateGroupAttributes>) => Promise<Group | null>
  delete: (id: number) => Promise<Group | null>
  addLeadToGroup: (groupId: number, leadId: number) => Promise<Group>
  removeLeadToGroup: (groupId: number, leadId: number) => Promise<Group>
}
