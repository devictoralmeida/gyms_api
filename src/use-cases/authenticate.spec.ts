import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { expect, it, describe, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hashSync } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    // 1º preciso cadastrar um usuário para testar o login

    await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhon.doe@gmail.com',
      password_hash: hashSync('123456', 6),
    })

    // 2º preciso ver se as credenciais são válidas, se for retorna um usuário.

    const { user } = await authenticateUseCase.execute({
      email: 'jhon.doe@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      authenticateUseCase.execute({
        email: 'jhon.doe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Jhon Doe',
      email: 'jhon.doe@gmail.com',
      password_hash: hashSync('123456', 6),
    })

    await expect(() =>
      authenticateUseCase.execute({
        email: 'jhon.doe@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
