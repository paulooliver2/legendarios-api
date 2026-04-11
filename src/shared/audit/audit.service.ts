import { prisma } from '../../prisma/client'

interface LogParams {
  actorId?: string
  action: string
  entity: string
  entityId?: string
  payload?: Record<string, unknown>
}

/**
 * Fire-and-forget — não bloqueia a resposta da request.
 */
export function auditLog(params: LogParams): void {
  setImmediate(() => {
    prisma.auditLog
      .create({
        data: {
          actorId: params.actorId,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          payload: params.payload as any,
        },
      })
      .catch((err) => console.error('[AuditLog Error]', err))
  })
}
