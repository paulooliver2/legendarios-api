import { Request, Response, NextFunction } from 'express'
import * as verificationsService from './verifications.service'
import { createVerificationSchema } from './verifications.schemas'

export async function createVerificationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createVerificationSchema.parse(req.body)
    const verification = await verificationsService.create(req.auth!.sub, input)
    res.status(201).json(verification)
  } catch (err) {
    next(err)
  }
}

export async function listPersonVerificationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const verifications = await verificationsService.listForPerson(req.params.personId as string)
    res.json(verifications)
  } catch (err) {
    next(err)
  }
}
