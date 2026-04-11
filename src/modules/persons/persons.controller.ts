import { Request, Response, NextFunction } from 'express'
import * as personsService from './persons.service'
import {
  createPersonSchema,
  updatePersonSchema,
  updateJourneySchema,
} from './persons.schemas'

export async function createPersonHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createPersonSchema.parse(req.body)
    const person = await personsService.create(input, req.auth!.sub)
    res.status(201).json(person)
  } catch (err) {
    next(err)
  }
}

export async function listPersonsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const page = req.query.page ? Number(req.query.page) : undefined
    const limit = req.query.limit ? Number(req.query.limit) : undefined
    const result = await personsService.list({ page, limit })
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function getPersonHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const person = await personsService.getById(req.params.id as string)
    res.json(person)
  } catch (err) {
    next(err)
  }
}

export async function updatePersonHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = updatePersonSchema.parse(req.body)
    const person = await personsService.update(req.params.id as string, input)
    res.json(person)
  } catch (err) {
    next(err)
  }
}

export async function promoteJourneyHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = updateJourneySchema.parse(req.body)
    const person = await personsService.promoteJourney(
      req.params.id as string,
      input,
      req.auth!.sub,
    )
    res.json(person)
  } catch (err) {
    next(err)
  }
}
