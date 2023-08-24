import { InMemoryUsersRepository } from './../repositories/in-memory/in-memory-users-repository'
import { expect, it, describe, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compareSync } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await registerUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhon.doe@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhon.doe@gmail.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = compareSync('123456', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'jhon.doe@gmail.com'

    await registerUseCase.execute({
      name: 'Jhon Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        // O execute é uma Promisse, então ou ela é resolvida ou rejeitada, no caso eu espero que ela rejeite e que o erro seja da classe UserAlreadyExistsError
        name: 'Jhon Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
