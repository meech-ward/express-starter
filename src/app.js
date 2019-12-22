import express from 'express'
import path from 'path'
import logger from 'morgan'

import catsRouter from './routes/cats'

const app = express()

app.use(logger(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))

app.use('/cats', catsRouter)

export default app