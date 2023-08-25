import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export const createAndAuthenticateAdmin = async (app: FastifyInstance) => {
  await prisma.user.create({
    data: {
      name: 'Victor Almeida',
      email: 'victor2@gmail.com',
      password_hash: await hash('123456', 6),
      role: 'ADMIN',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'victor2@gmail.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
