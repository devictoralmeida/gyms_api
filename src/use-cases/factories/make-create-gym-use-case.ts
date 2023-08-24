import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

export const makeCreateGymUseCase = () => {
  const prismaGymsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymUseCase(prismaGymsRepository)
  return useCase
}
