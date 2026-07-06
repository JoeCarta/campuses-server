// server-side validation. never trust the client.
// each function returns an array of error strings — empty means valid.
// partial mode (for PUT) only checks fields that were actually sent.

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0
}

export function validateCampus(body, { partial = false } = {}) {
  const errors = []
  const has = (k) => body[k] !== undefined

  if (!partial || has('name')) {
    if (!isNonEmptyString(body.name)) errors.push('name is required')
  }
  if (!partial || has('address')) {
    if (!isNonEmptyString(body.address)) errors.push('address is required')
  }
  if (!partial || has('description')) {
    if (!isNonEmptyString(body.description)) errors.push('description is required')
  }
  if (has('imageUrl') && typeof body.imageUrl !== 'string') {
    errors.push('imageUrl must be a string')
  }
  return errors
}

export function validateStudent(body, { partial = false } = {}) {
  const errors = []
  const has = (k) => body[k] !== undefined

  if (!partial || has('firstName')) {
    if (!isNonEmptyString(body.firstName)) errors.push('firstName is required')
  }
  if (!partial || has('lastName')) {
    if (!isNonEmptyString(body.lastName)) errors.push('lastName is required')
  }
  if (!partial || has('email')) {
    if (!isNonEmptyString(body.email) || !emailRe.test(body.email)) {
      errors.push('a valid email is required')
    }
  }
  if (!partial || has('gpa')) {
    const gpa = Number(body.gpa)
    if (Number.isNaN(gpa) || gpa < 0 || gpa > 4) {
      errors.push('gpa must be a number between 0 and 4')
    }
  }
  // campusId is optional and nullable. if present it must be null or a positive int.
  if (has('campusId') && body.campusId !== null) {
    const id = Number(body.campusId)
    if (!Number.isInteger(id) || id < 1) {
      errors.push('campusId must be a positive integer or null')
    }
  }
  if (has('imageUrl') && typeof body.imageUrl !== 'string') {
    errors.push('imageUrl must be a string')
  }
  return errors
}
