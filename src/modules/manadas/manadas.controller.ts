import { Request, Response, NextFunction } from 'express'
import * as pistasService from './manadas.service'
import {
  addPistaMemberSchema,
  createPistaSchema,
  createPistaTeamSchema,
  setMemberRoleSchema,
} from './manadas.schemas'

export async function createPistaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createPistaSchema.parse(req.body)
    const pista = await pistasService.create(input)
    res.status(201).json(pista)
  } catch (err) {
    next(err)
  }
}

export async function listPistasHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const pistas = await pistasService.list()
    res.json(pistas)
  } catch (err) {
    next(err)
  }
}

export async function getPistaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const pista = await pistasService.getById(req.params.id as string)
    res.json(pista)
  } catch (err) {
    next(err)
  }
}

export async function addPistaMemberHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { personId, memberRole, pistaTeamId } = addPistaMemberSchema.parse(req.body)
    const member = await pistasService.addMember(req.params.id as string, personId, memberRole, pistaTeamId)
    res.status(201).json(member)
  } catch (err) {
    next(err)
  }
}

export async function setMemberRoleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = setMemberRoleSchema.parse(req.body)
    const member = await pistasService.setMemberRole(
      req.params.id as string,
      req.params.personId as string,
      input,
    )
    res.json(member)
  } catch (err) {
    next(err)
  }
}

export async function listPistaMembersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const members = await pistasService.listMembers(req.params.id as string)
    res.json(members)
  } catch (err) {
    next(err)
  }
}

export async function joinPistaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const personId = req.auth!.personId
    const member = await pistasService.joinPista(req.params.id as string, personId)
    res.status(201).json(member)
  } catch (err) {
    next(err)
  }
}

export async function createPistaTeamHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createPistaTeamSchema.parse(req.body)
    const team = await pistasService.addTeam(req.params.id as string, input)
    res.status(201).json(team)
  } catch (err) {
    next(err)
  }
}

export async function listPistaTeamsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const teams = await pistasService.listTeams(req.params.id as string)
    res.json(teams)
  } catch (err) {
    next(err)
  }
}
