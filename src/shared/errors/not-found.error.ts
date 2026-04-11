import { AppError } from './app-error'

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} não encontrado(a).`, 404, 'NOT_FOUND')
  }
}
