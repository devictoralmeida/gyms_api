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

  it('shoud be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
  })
})
