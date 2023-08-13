import { Request, Response } from 'express'
import { prisma } from '../prisma'

let userClient = prisma.user

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const data = req.body

  const userPayload = {
    username: data.username,
    fullName: data.fullName,
    email: data.email,
    dateOfBirth: new Date(data.dateOfBirth).toISOString(),
  }

  const user = await userClient.create({
    data: userPayload,
  })

  res.status(201).json({ data: user })
}
