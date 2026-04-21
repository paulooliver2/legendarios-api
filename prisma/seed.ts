import { PrismaClient, SystemRole, JourneyStatus, EventType, EventRole, EventStatus } from '@prisma/client'
import { hashSync } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ── Admin ────────────────────────────────────────────────────────────────────
  const adminPerson = await prisma.person.upsert({
    where: { email: 'admin@legendarios.com' },
    update: {},
    create: {
      fullName: 'Administrador',
      email: 'admin@legendarios.com',
      journeyStatus: JourneyStatus.LEGENDARIO,
      userAccount: {
        create: {
          username: 'admin',
          passwordHash: hashSync('admin123', 10),
          systemRole: SystemRole.ADMIN,
        },
      },
    },
  })
  console.log(`Admin: ${adminPerson.fullName}`)

  // ── Sample persons ───────────────────────────────────────────────────────────
  const legendario = await prisma.person.upsert({
    where: { email: 'joao@legendarios.com' },
    update: {},
    create: {
      fullName: 'João Legendário',
      email: 'joao@legendarios.com',
      journeyStatus: JourneyStatus.LEGENDARIO,
      journeyChangedAt: new Date(),
    },
  })

  const preLegendario = await prisma.person.upsert({
    where: { email: 'mario@legendarios.com' },
    update: {},
    create: {
      fullName: 'Mario Pré-Legendário',
      email: 'mario@legendarios.com',
      journeyStatus: JourneyStatus.PRE_LEGENDARIO,
    },
  })
  console.log(`Pessoas: ${legendario.fullName}, ${preLegendario.fullName}`)

  // ── Pista ────────────────────────────────────────────────────────────────────
  const pista = await prisma.pista.upsert({
    where: { name: 'Pista dos Guerreiros' },
    update: {},
    create: {
      name: 'Pista dos Guerreiros',
      description: 'Pista de exemplo para desenvolvimento',
    },
  })

  await prisma.pistaMember.upsert({
    where: { personId_pistaId: { personId: legendario.id, pistaId: pista.id } },
    update: {},
    create: { personId: legendario.id, pistaId: pista.id },
  })
  console.log(`Pista: ${pista.name}`)

  // ── Event ────────────────────────────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'TOP Legendários 2026',
      type: EventType.TOP,
      description: 'Evento TOP de exemplo para desenvolvimento',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-03'),
      status: EventStatus.INSCRICOES_ABERTAS,
      limiteServos: 30,
      limiteParticipantes: 50,
    },
  })

  const team1 = await prisma.eventTeam.upsert({
    where: { eventId_name: { eventId: event.id, name: 'Equipe Alpha' } },
    update: {},
    create: { eventId: event.id, name: 'Equipe Alpha' },
  })

  const team2 = await prisma.eventTeam.upsert({
    where: { eventId_name: { eventId: event.id, name: 'Equipe Beta' } },
    update: {},
    create: { eventId: event.id, name: 'Equipe Beta' },
  })
  console.log(`Evento: ${event.name} — Equipes: ${team1.name}, ${team2.name}`)

  // ── Memberships ───────────────────────────────────────────────────────────────
  const membership = await prisma.eventMembership.upsert({
    where: { personId_eventId: { personId: legendario.id, eventId: event.id } },
    update: {},
    create: {
      personId: legendario.id,
      eventId: event.id,
      role: EventRole.SERVO,
      status: 'APROVADO',
    },
  })

  await prisma.eventMembership.upsert({
    where: { personId_eventId: { personId: preLegendario.id, eventId: event.id } },
    update: {},
    create: {
      personId: preLegendario.id,
      eventId: event.id,
      role: EventRole.PARTICIPANTE,
      status: 'EM_ANALISE',
    },
  })
  console.log(`Inscrições criadas. Aprovada: ${membership.id}`)

  // ── Team membership ───────────────────────────────────────────────────────────
  await prisma.teamMembership.upsert({
    where: { personId_eventTeamId: { personId: legendario.id, eventTeamId: team1.id } },
    update: {},
    create: { personId: legendario.id, eventTeamId: team1.id, teamRole: 'LIDER' },
  })

  console.log('Seed concluído com sucesso.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
