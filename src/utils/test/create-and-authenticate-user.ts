import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export const createAndAuthenticateUser = async (
  app: FastifyInstance,
  isAdmin = false, // valor padrão de Falso
) => {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'john.doe@gmail.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
