import { HttpError } from "../errors/HttpError";
import { CreateLeadAttributes, LeadsRepository, LeadStatus, LeadWhereParams } from "../repositories/LeadsRepository";

// criando uma tipagem para paginação 
interface GetLeadsWithPaginationParams {
    page?: number
    pageSize?: number
    name?: string
    status?: LeadStatus
    sortBy?: "name" | "status" | "createdAt"
    order?: "asc" | "desc"
}


export class LeadsService {
  // injetando a dependecia -> isso é muito importante
  constructor(private readonly leadsRepository: LeadsRepository){}

  async getAllLeads(params: GetLeadsWithPaginationParams) {
    // desistruturando os parametros 
    const {page = 1, pageSize = 10, name, status, order, sortBy} = params

    // regra de paginação 
    const offset = (page - 1) * pageSize;

    const where: LeadWhereParams = {};

    // adicionando filtros dec busca
    if (name) where.name = { like: name, mode: "insensitive" };
    if (status) where.status = status;

    // fazendo a consulta

    const leads = await this.leadsRepository.find({
      where,
      sortBy,
      order,
      limit: pageSize,
      offset: offset,
    });

    const totalCount = await this.leadsRepository.count(where);

    return {
        data: leads,
        meta: {
          totalCount, // total de registros encontrados
          page: page, // página atual
          pageSize: pageSize, // tamanho da página
          totalPages: Math.ceil(totalCount / pageSize), // total de páginas
        }}
  }

  async createLead(params: CreateLeadAttributes){

    // Verifica se o status foi enviado, caso contrário define como "New"
      if (!params.status) params.status = "New";
      // Cria o lead no banco de dados
      const newLead = await this.leadsRepository.create(params);

      return newLead
  }

  async findLeadId(id: number) {
    const lead = await this.leadsRepository.findById(id);
    if (!lead) throw new HttpError(404, "Lead não encontrado para exibição");
    return lead
  }

  async updateLead(idLead: number, params: Partial<CreateLeadAttributes>) {

    const leadExists = await this.leadsRepository.findById(idLead);
      if (!leadExists) throw new HttpError(404, "lead não encontrado");

      // Verifica se o lead já foi devidamente contatado
      if (leadExists.status === "New" && params.status !== "Contacted") {
        throw new HttpError(
          400,
          "um novo lead deve ser contatado antes de ter seu status atualizado para outros valores"
        );
      }

      // Valida a inatividade nesse lead em casa de arquivamente
      if (params.status === "Archived") {
        const now = new Date();
        const diffTime = Math.abs(
          now.getTime() - leadExists.updatedAt.getTime()
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 180)
          throw new HttpError(
            400,
            "um lead só pode ser arquivado após 6 meses de inatividade"
          );
      }

      const updatedLead = await this.leadsRepository.updateById(idLead, params);
      return updatedLead
  }

  async deletedLead(idLead: number){
    const leadExists = await this.leadsRepository.findById(idLead);
      if (!leadExists) throw new HttpError(404, "lead não encontrado");

      const deletedLead = await this.leadsRepository.delete(idLead);
      return deletedLead
  }
   
}
