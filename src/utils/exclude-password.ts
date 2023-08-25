import { User } from '@prisma/client'

export const excludePassword = (user: User, ...keys: any) => {
  for (const key of keys) {
    delete user[key]
  }
  return user
}
