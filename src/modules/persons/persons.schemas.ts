import { z } from 'zod'
import { JourneyStatus } from '@prisma/client'

export const createPersonSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  birthDate: z.string().datetime().optional(),

  // Identificação
  numeroLegendario: z.string().optional(),
  cpf: z.string().optional(),

  // Endereço
  uf: z.string().max(2).optional(),
  cidade: z.string().optional(),
  cep: z.string().optional(),

  // Flags
  jaServiu: z.boolean().optional(),
  certificado: z.boolean().optional(),
  problemaDeSaude: z.boolean().optional(),

  // Contexto eclesial / familiar
  igreja: z.string().optional(),
  nomeLider: z.string().optional(),
  numeroLider: z.string().optional(),
  nomeEsposa: z.string().optional(),
  nomeMae: z.string().optional(),
  numeroParente: z.string().optional(),

  // Foto
  photoUrl: z.string().url().optional(),
})

export const updatePersonSchema = createPersonSchema.partial()

export const updateJourneySchema = z.object({
  journeyStatus: z.nativeEnum(JourneyStatus),
  reason: z.string().optional(),
})

export type CreatePersonInput = z.infer<typeof createPersonSchema>
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>
export type UpdateJourneyInput = z.infer<typeof updateJourneySchema>
