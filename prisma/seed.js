import { prisma } from '../src/prisma.js'
import { DEFAULT_CAMPUS_IMAGE, DEFAULT_STUDENT_IMAGE } from '../src/constants.js'

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
      imageUrl: DEFAULT_CAMPUS_IMAGE,
    },
  })

  const brooklyn = await prisma.campus.create({
    data: {
      name: 'Brooklyn College',
      address: '2900 Bedford Ave, Brooklyn, NY 11210',
      description: 'cuny campus in flatbush, brooklyn.',
      imageUrl: DEFAULT_CAMPUS_IMAGE,
    },
  })

  const city = await prisma.campus.create({
    data: {
      name: 'City College',
      address: '160 Convent Ave, New York, NY 10031',
      description: 'the founding campus of cuny, in harlem.',
      imageUrl: DEFAULT_CAMPUS_IMAGE,
    },
  })

  await prisma.student.createMany({
    data: [
      { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', gpa: 3.9, imageUrl: DEFAULT_STUDENT_IMAGE, campusId: hunter.id },
      { firstName: 'Alan', lastName: 'Turing', email: 'alan@example.com', gpa: 4.0, imageUrl: DEFAULT_STUDENT_IMAGE, campusId: hunter.id },
      { firstName: 'Grace', lastName: 'Hopper', email: 'grace@example.com', gpa: 3.8, imageUrl: DEFAULT_STUDENT_IMAGE, campusId: brooklyn.id },
      { firstName: 'Katherine', lastName: 'Johnson', email: 'katherine@example.com', gpa: 3.95, imageUrl: DEFAULT_STUDENT_IMAGE, campusId: city.id },
      // one unenrolled student so the "not enrolled" path has data
      { firstName: 'Linus', lastName: 'Torvalds', email: 'linus@example.com', gpa: 3.5, imageUrl: DEFAULT_STUDENT_IMAGE, campusId: null },
    ],
  })

  console.log('seeded 3 campuses + 5 students')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
