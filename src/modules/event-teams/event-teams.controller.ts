import { Request, Response, NextFunction } from 'express'
import * as eventTeamsService from './event-teams.service'
import { createEventTeamSchema } from './event-teams.schemas'

export async function createEventTeamHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createEventTeamSchema.parse(req.body)
    const team = await eventTeamsService.create(req.params.eventId as string, input)
    res.status(201).json(team)
  } catch (err) {
    next(err)
  }
}

export async function listEventTeamsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const teams = await eventTeamsService.list(req.params.eventId as string)
    res.json(teams)
  } catch (err) {
    next(err)
  }
}

export async function getEventTeamHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const team = await eventTeamsService.getById(
      req.params.eventId as string,
      req.params.teamId as string,
    )
    res.json(team)
  } catch (err) {
    next(err)
  }
}

export async function deleteEventTeamHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await eventTeamsService.remove(req.params.eventId as string, req.params.teamId as string)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
