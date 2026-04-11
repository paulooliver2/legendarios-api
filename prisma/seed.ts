import { PrismaClient, SystemRole, JourneyStatus, EventType, EventRole } from '@prisma/client'
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
    where: { email: 'maria@legendarios.com' },
    update: {},
    create: {
      fullName: 'Maria Pré-Legendária',
      email: 'maria@legendarios.com',
      journeyStatus: JourneyStatus.PRE_LEGENDARIO,
    },
  })
  console.log(`Pessoas: ${legendario.fullName}, ${preLegendario.fullName}`)

  // ── Manada ───────────────────────────────────────────────────────────────────
  const manada = await prisma.manada.upsert({
    where: { id: 'seed-manada-01' },
    update: {},
    create: {
      id: 'seed-manada-01',
      name: 'Manada dos Guerreiros',
      description: 'Manada de exemplo para desenvolvimento',
    },
  })

  await prisma.manadaMember.upsert({
    where: { personId_manadaId: { personId: legendario.id, manadaId: manada.id } },
    update: {},
    create: { personId: legendario.id, manadaId: manada.id },
  })
  console.log(`Manada: ${manada.name}`)

  // ── Event ────────────────────────────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { id: 'seed-event-01' },
    update: {},
    create: {
      id: 'seed-event-01',
      name: 'TOP Legendários 2026',
      type: EventType.TOP,
      description: 'Evento TOP de exemplo para desenvolvimento',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-03'),
      isPublished: true,
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
