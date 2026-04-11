import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import * as manadasService from './manadas.service'
import { createManadaSchema } from './manadas.schemas'

export async function createManadaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createManadaSchema.parse(req.body)
    const manada = await manadasService.create(input)
    res.status(201).json(manada)
  } catch (err) {
    next(err)
  }
}

export async function listManadasHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const manadas = await manadasService.list()
    res.json(manadas)
  } catch (err) {
    next(err)
  }
}

export async function getManadaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const manada = await manadasService.getById(req.params.id as string)
    res.json(manada)
  } catch (err) {
    next(err)
  }
}

export async function addManadaMemberHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { personId } = z.object({ personId: z.string().uuid() }).parse(req.body)
    const member = await manadasService.addMember(req.params.id as string, personId)
    res.status(201).json(member)
  } catch (err) {
    next(err)
  }
}

export async function listManadaMembersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const members = await manadasService.listMembers(req.params.id as string)
    res.json(members)
  } catch (err) {
    next(err)
  }
}
