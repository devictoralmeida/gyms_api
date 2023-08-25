import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

export type TRole = 'ADMIN' | 'MEMBER'

interface IRegisterUserRequest {
  name: string
  email: string
  password: string
  role?: TRole
}

interface IRegisterUserResponse {
  user: User
}

export class RegisterUseCase {
  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async execute({
    name,
    email,
    password,
    role,
  }: IRegisterUserRequest): Promise<IRegisterUserResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
      role,
    })

    return { user }
  }
}
