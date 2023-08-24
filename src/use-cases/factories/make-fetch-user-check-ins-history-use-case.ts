import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export const makeFetchUserCheckInsHistoryUseCase = () => {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(prismaCheckInsRepository)
  return useCase
}
