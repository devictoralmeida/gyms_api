import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

export const makeFetchNearbyGymsUseCase = () => {
  const prismaGymsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymsUseCase(prismaGymsRepository)
  return useCase
}
