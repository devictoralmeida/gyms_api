import { FastifyRequest, FastifyReply } from 'fastify'

export const refresh = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> => {
  await request.jwtVerify({ onlyCookie: true }) // Aqui ele vai ver se nos cookies da requisição tem o refresh token

  const { role } = request.user

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub, // Aqui eu não tenho acesso ao user, então uso o sub.
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
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
}
