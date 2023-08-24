import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { expect, it, describe, beforeEach } from 'vitest'
import { hashSync } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found'

let usersRepository: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhon.doe@gmail.com',
      password_hash: hashSync('123456', 6),
    })

    const { user } = await getUserProfileUseCase.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('Jhon Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      getUserProfileUseCase.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
