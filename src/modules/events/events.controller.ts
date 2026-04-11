import { Request, Response, NextFunction } from 'express'
import * as eventsService from './events.service'
import { createEventSchema, updateEventSchema } from './events.schemas'

export async function createEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createEventSchema.parse(req.body)
    const event = await eventsService.create(input)
    res.status(201).json(event)
  } catch (err) {
    next(err)
  }
}

export async function listEventsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await eventsService.list({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      type: req.query.type as string | undefined,
      published: req.query.published as string | undefined,
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function getEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await eventsService.getById(req.params.id as string)
    res.json(event)
  } catch (err) {
    next(err)
  }
}

export async function updateEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = updateEventSchema.parse(req.body)
    const event = await eventsService.update(req.params.id as string, input)
    res.json(event)
  } catch (err) {
    next(err)
  }
}

export async function publishEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const isPublished = req.body.isPublished === true
    const event = await eventsService.publish(req.params.id as string, isPublished)
    res.json(event)
  } catch (err) {
    next(err)
  }
}

export async function deleteEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await eventsService.remove(req.params.id as string)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
