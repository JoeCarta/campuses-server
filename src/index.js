import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import campusRoutes from './routes/campuses.js'
import studentRoutes from './routes/students.js'

const app = express()

app.use(cors()) // let the deployed frontend call this api
app.use(express.json()) // parse json request bodies

// simple health check / friendly root
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'campuses-server' })
})

app.use('/campuses', campusRoutes)
app.use('/students', studentRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`)
})
