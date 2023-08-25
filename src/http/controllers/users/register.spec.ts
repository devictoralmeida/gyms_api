import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register an user and return it without password', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456',
    })

    const { user } = response.body

    expect(response.statusCode).toBe(201)
    expect(user).toEqual(
      expect.not.objectContaining({ password_hash: expect.anything() }),
    )
  })
})
