import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'

export const makeValidateCheckInUseCase = () => {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInUseCase(prismaCheckInsRepository)
  return useCase
}
