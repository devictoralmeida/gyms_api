import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { register } from './register'
import { refresh } from './refresh'

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  /* Rotas autenticadas */
  app.get('/me', { onRequest: [verifyJWT] }, profile) // Estou salvando esse onRequest para que ele seja acessível em outras rotas por meio da chave desse objeto
}
