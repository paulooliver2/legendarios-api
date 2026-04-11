import { Request, Response, NextFunction } from 'express'
import { TeamRole } from '@prisma/client'
import * as teamMembershipsService from './team-memberships.service'
import { createTeamMembershipSchema } from './team-memberships.schemas'

export async function assignHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createTeamMembershipSchema.parse(req.body)
    const tm = await teamMembershipsService.assign(
      input.personId,
      input.eventTeamId,
      input.teamRole as TeamRole,
    )
    res.status(201).json(tm)
  } catch (err) {
    next(err)
  }
}

export async function listTeamMembersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const members = await teamMembershipsService.listMembers(req.params.teamId as string)
    res.json(members)
  } catch (err) {
    next(err)
  }
}

export async function listPersonTeamsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const teams = await teamMembershipsService.listPersonTeams(req.params.personId as string)
    res.json(teams)
  } catch (err) {
    next(err)
  }
}
