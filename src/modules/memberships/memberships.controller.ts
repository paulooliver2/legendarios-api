import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { EventMembershipStatus, EventRole } from '@prisma/client'
import * as membershipsService from './memberships.service'
import { createMembershipSchema, updateMembershipStatusSchema } from './memberships.schemas'

export async function createMembershipHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createMembershipSchema.parse(req.body)
    const membership = await membershipsService.create(input.personId, input.eventId, input.role as EventRole)
    res.status(201).json(membership)
  } catch (err) {
    next(err)
  }
}

export async function listMembershipsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const memberships = await membershipsService.list({
      eventId: req.query.eventId as string | undefined,
      personId: req.query.personId as string | undefined,
      status: req.query.status as string | undefined,
    })
    res.json(memberships)
  } catch (err) {
    next(err)
  }
}

export async function getMembershipHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const membership = await membershipsService.getById(req.params.id as string)
    res.json(membership)
  } catch (err) {
    next(err)
  }
}

export async function updateMembershipStatusHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = updateMembershipStatusSchema.parse(req.body)
    const membership = await membershipsService.transition(
      req.params.id as string,
      input.status as EventMembershipStatus,
      req.auth!.sub,
      input.reason,
    )
    res.json(membership)
  } catch (err) {
    next(err)
  }
}

export async function approveMembershipHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const membership = await membershipsService.approve(req.params.id as string, req.auth!.sub)
    res.json(membership)
  } catch (err) {
    next(err)
  }
}

export async function refuseMembershipHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { reason } = z.object({ reason: z.string().min(1) }).parse(req.body)
    const membership = await membershipsService.refuse(req.params.id as string, req.auth!.sub, reason)
    res.json(membership)
  } catch (err) {
    next(err)
  }
}

export async function getMembershipHistoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const history = await membershipsService.getHistory(req.params.id as string)
    res.json(history)
  } catch (err) {
    next(err)
  }
}
