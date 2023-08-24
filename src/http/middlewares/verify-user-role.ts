import { FastifyRequest, FastifyReply } from 'fastify'

// Aqui hook, uma função que recebe uma role e retorna um middleware que derá um erro se o role for diferente do enviado por parâmetro.

export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user
    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
