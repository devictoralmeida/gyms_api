import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { usersRoutes } from './http/controllers/users/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.SECRET_KEY,
  cookie: {
    // Essas configurações é pra dizer que esse cookie não é assinado por uma SECRET_KEY
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m', // 10 minutes
  },
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // Aqui nós devemos enviar os logs de erros para outra ferramenta externa
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
