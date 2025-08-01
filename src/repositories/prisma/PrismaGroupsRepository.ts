import { Group } from "@prisma/client";
import { CreateGroupAttributes, GroupsRepository } from "../GroupsRepository";
import { prisma } from "../../../prisma/database";

export class PrismaGroupsRepository implements GroupsRepository {
  find(): Promise<Group[]> {
    return prisma.group.findMany();
  }
  findById(id: number): Promise<Group | null> {
    return prisma.group.findUnique({ where: { id } });
  }

  create(attributes: CreateGroupAttributes): Promise<Group> {
    return prisma.group.create({ data: attributes });
  }

  updateById(
    id: number,
    attributes: Partial<CreateGroupAttributes>
  ): Promise<Group | null> {
    return prisma.group.update({
      where: { id },
      data: attributes,
    });
  }

  delete(id: number): Promise<Group | null> {
    return prisma.group.delete({ where: { id } });
  }

  addLeadToGroup(groupId: number, leadId: number): Promise<Group> {
    return prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        leads: {
          connect: { id: leadId }, // conecta lead existente ao grupo
        },
      },
      include: { leads: true }, // retorna os leads atualizados no grupo
    });
  }

  removeLeadToGroup(groupId: number, leadId: number): Promise<Group>{
    return prisma.group.update({
        where: { id: groupId },
        data: {
          leads: {
            disconnect: { id: leadId }, // remove a relação com o lead
          },
        },
        include: { leads: true }, // retorna o grupo atualizado
      });
  }
}
