import { PrismaClient } from "@prisma/client";

// Aqui criamos uma instancia de PrismaClient para interagir com o banco de dados
// onde podemos no arquivo de rota gerir o crud de forma mais simples
// e com tipagem do TypeScript
export const prisma = new PrismaClient()
