import { app } from '@/app'
import { createAndAuthenticateAdmin } from '@/utils/test/create-and-authenticate-admin'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateAdmin(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gyms',
        description: 'Something',
        phone: '1199999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    expect(response.statusCode).toBe(201)
  })

  it('should NOT be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gyms',
        description: 'Something',
        phone: '1199999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual(
      expect.objectContaining({ message: 'Unauthorized.' }),
    )
  })
})
