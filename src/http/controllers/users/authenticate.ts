import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> => {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()
    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d', // 7 dias
        },
      },
    )

    return reply
      .status(200)
      .setCookie('refreshToken', refreshToken, {
        path: '/', // Essa barra significa que todas as rotas terão acesso a esse cookie
        secure: true, // Isso faz com que o cookie seja encriptado pelo HTTPS
        sameSite: true, // Isso faz com que o cookie só seja acessível pelo mesmo domínio
        httpOnly: true, // Isso faz com que o cookie só seja acessado pelo backend
      })
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
