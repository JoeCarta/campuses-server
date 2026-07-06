import { Router } from 'express'
import { prisma } from '../prisma.js'
import { validateCampus } from '../validation.js'
import { DEFAULT_CAMPUS_IMAGE } from '../constants.js'

const router = Router()

// reject non-numeric ids before they ever reach the db
router.param('id', (req, res, next, value) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'invalid id' })
  }
  req.id = id
  next()
})

// GET /campuses — list all
router.get('/', async (req, res) => {
  const campuses = await prisma.campus.findMany({ orderBy: { id: 'asc' } })
  res.json(campuses)
})

// GET /campuses/:id — one campus + its enrolled students
router.get('/:id', async (req, res) => {
  const campus = await prisma.campus.findUnique({
    where: { id: req.id },
    include: { students: true },
  })
  if (!campus) return res.status(404).json({ error: 'campus not found' })
  res.json(campus)
})

// POST /campuses — create
router.post('/', async (req, res) => {
  const errors = validateCampus(req.body)
  if (errors.length) return res.status(400).json({ errors })

  const campus = await prisma.campus.create({
    data: {
      name: req.body.name.trim(),
      address: req.body.address.trim(),
      description: req.body.description.trim(),
      imageUrl: req.body.imageUrl?.trim() || DEFAULT_CAMPUS_IMAGE,
    },
  })
  res.status(201).json(campus)
})

// PUT /campuses/:id — update (partial body allowed)
router.put('/:id', async (req, res) => {
  const errors = validateCampus(req.body, { partial: true })
  if (errors.length) return res.status(400).json({ errors })

  try {
    const campus = await prisma.campus.update({
      where: { id: req.id },
      data: {
        name: req.body.name?.trim(),
        address: req.body.address?.trim(),
        description: req.body.description?.trim(),
        imageUrl: req.body.imageUrl?.trim() || undefined,
      },
    })
    res.json(campus)
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'campus not found' })
    res.status(400).json({ error: 'could not update campus' })
  }
})

// DELETE /campuses/:id — students are un-enrolled (onDelete: SetNull), not deleted
router.delete('/:id', async (req, res) => {
  try {
    await prisma.campus.delete({ where: { id: req.id } })
    res.status(204).end()
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'campus not found' })
    res.status(400).json({ error: 'could not delete campus' })
  }
})

export default router
