import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'

export const makeGetUserProfileUseCase = () => {
  const prismaUsersRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUseCase(prismaUsersRepository)
  return useCase
}
