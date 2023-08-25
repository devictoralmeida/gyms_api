import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { excludePassword } from '@/utils/exclude-password'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'MEMBER']).optional().default('MEMBER'),
  })

  const { name, email, password, role } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    const { user } = await registerUseCase.execute({
      name,
      email,
      password,
      role,
    })

    const userWithoutPassword = excludePassword(user, 'password_hash')
    return reply.status(201).send({ userWithoutPassword })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err // jogando o erro para outra camada acima do controller faça o seu tratamento
  }
}
