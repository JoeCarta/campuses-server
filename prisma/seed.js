import { prisma } from '../src/prisma.js'

// name-based images so seeded records look distinct and intentional (on-brand violet).
const campusBanner = (name) =>
  `https://placehold.co/600x400/7c3aed/ffffff?text=${encodeURIComponent(name)}&font=montserrat`
const studentAvatar = (first, last) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(`${first} ${last}`)}&background=7c3aed&color=fff&size=400&bold=true`

// wipe + repopulate so the deployed app isn't empty
async function main() {
  // students reference campuses, so clear them first
  await prisma.student.deleteMany()
  await prisma.campus.deleteMany()

  const hunter = await prisma.campus.create({
    data: {
      name: 'Hunter College',
      address: '695 Park Ave, New York, NY 10065',
      description: 'a senior college of the city university of new york.',
      imageUrl: campusBanner('Hunter College'),
    },
  })

  const brooklyn = await prisma.campus.create({
    data: {
      name: 'Brooklyn College',
      address: '2900 Bedford Ave, Brooklyn, NY 11210',
      description: 'cuny campus in flatbush, brooklyn.',
      imageUrl: campusBanner('Brooklyn College'),
    },
  })

  const city = await prisma.campus.create({
    data: {
      name: 'City College',
      address: '160 Convent Ave, New York, NY 10031',
      description: 'the founding campus of cuny, in harlem.',
      imageUrl: campusBanner('City College'),
    },
  })

  await prisma.student.createMany({
    data: [
      { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', gpa: 3.9, imageUrl: studentAvatar('Ada', 'Lovelace'), campusId: hunter.id },
      { firstName: 'Alan', lastName: 'Turing', email: 'alan@example.com', gpa: 4.0, imageUrl: studentAvatar('Alan', 'Turing'), campusId: hunter.id },
      { firstName: 'Grace', lastName: 'Hopper', email: 'grace@example.com', gpa: 3.8, imageUrl: studentAvatar('Grace', 'Hopper'), campusId: brooklyn.id },
      { firstName: 'Katherine', lastName: 'Johnson', email: 'katherine@example.com', gpa: 3.95, imageUrl: studentAvatar('Katherine', 'Johnson'), campusId: city.id },
      { firstName: 'Noam', lastName: 'Chomsky', email: 'noam@example.com', gpa: 3.7, imageUrl: studentAvatar('Noam', 'Chomsky'), campusId: hunter.id },
      { firstName: 'Leibniz', lastName: '(the other derivative guy)', email: 'leibniz@example.com', gpa: 4.0, imageUrl: studentAvatar('Gottfried', 'Leibniz'), campusId: brooklyn.id },
      // one unenrolled student so the "not enrolled" path has data
      { firstName: 'Linus', lastName: 'Torvalds', email: 'linus@example.com', gpa: 3.5, imageUrl: studentAvatar('Linus', 'Torvalds'), campusId: null },
    ],
  })

  console.log('seeded 3 campuses + 7 students')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
