import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { nearby } from './nearby'
import { search } from './search'
import { create } from './create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT) // Todas as rodas abaixo utilização o middleware de autenticação.

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)

  /* Rotas protegidas por role. */
  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
