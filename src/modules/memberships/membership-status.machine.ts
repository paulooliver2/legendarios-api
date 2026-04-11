import { EventMembershipStatus } from '@prisma/client'

const VALID_TRANSITIONS: Record<EventMembershipStatus, EventMembershipStatus[]> = {
  PRE_INSCRITO: ['INSCRITO', 'CANCELADO'],
  INSCRITO:     ['EM_ANALISE', 'CANCELADO'],
  EM_ANALISE:   ['APROVADO', 'RECUSADO'],
  APROVADO:     ['CANCELADO'],
  RECUSADO:     [],
  CANCELADO:    [],
}

export function canTransition(from: EventMembershipStatus, to: EventMembershipStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false
}
