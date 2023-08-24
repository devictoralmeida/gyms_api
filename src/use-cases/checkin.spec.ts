import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './checkin'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

    // Criando uma academia, que será necessária para realizar um checkIn.

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: 'Vamos praticar node',
      phone: '123',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    // 1º Criando Mock da data fake

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    // 2º Criando checkin

    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    // 1º Criando Mock da data fake

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    // 2º Criando checkin

    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    // 3º Setando a data para um dia depois

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String)) // = CheckIn criado com sucesso e com id.
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Javascript Gym',
      description: 'Vamos praticar node',
      phone: '123',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
