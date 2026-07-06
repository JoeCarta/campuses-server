import { Router } from 'express'
import { prisma } from '../prisma.js'
import { validateStudent } from '../validation.js'
import { DEFAULT_STUDENT_IMAGE } from '../constants.js'

const router = Router()

router.param('id', (req, res, next, value) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'invalid id' })
  }
  req.id = id
  next()
})

// GET /students — list all (include campus so lists can show it)
router.get('/', async (req, res) => {
  const students = await prisma.student.findMany({
    orderBy: { id: 'asc' },
    include: { campus: true },
  })
  res.json(students)
})

// GET /students/:id — one student + their campus (or null if unenrolled)
router.get('/:id', async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: req.id },
    include: { campus: true },
  })
  if (!student) return res.status(404).json({ error: 'student not found' })
  res.json(student)
})

// POST /students — create
router.post('/', async (req, res) => {
  const errors = validateStudent(req.body)
  if (errors.length) return res.status(400).json({ errors })

  try {
    const student = await prisma.student.create({
      data: {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        email: req.body.email.trim(),
        gpa: Number(req.body.gpa),
        imageUrl: req.body.imageUrl?.trim() || DEFAULT_STUDENT_IMAGE,
        campusId: req.body.campusId != null ? Number(req.body.campusId) : null,
      },
    })
    res.status(201).json(student)
  } catch (e) {
    // P2002 = duplicate email, P2003 = campusId points at a missing campus
    res.status(400).json({ error: 'could not create student', code: e.code })
  }
})

// PUT /students/:id — update (partial). also used to change or clear campus.
router.put('/:id', async (req, res) => {
  const errors = validateStudent(req.body, { partial: true })
  if (errors.length) return res.status(400).json({ errors })

  const data = {
    firstName: req.body.firstName?.trim(),
    lastName: req.body.lastName?.trim(),
    email: req.body.email?.trim(),
    imageUrl: req.body.imageUrl?.trim() || undefined,
  }
  if (req.body.gpa !== undefined) data.gpa = Number(req.body.gpa)
  // campusId can be sent as null to un-enroll the student
  if (req.body.campusId !== undefined) {
    data.campusId = req.body.campusId === null ? null : Number(req.body.campusId)
  }

  try {
    const student = await prisma.student.update({ where: { id: req.id }, data })
    res.json(student)
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'student not found' })
    res.status(400).json({ error: 'could not update student', code: e.code })
  }
})

// DELETE /students/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.student.delete({ where: { id: req.id } })
    res.status(204).end()
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'student not found' })
    res.status(400).json({ error: 'could not delete student' })
  }
})

export default router
