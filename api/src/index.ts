import express, { Express } from 'express'
import router from './router'

const app: Express = express()
const port = 3000

app.use('/', router)

app.listen(port, () => console.log(`app listening on port ${port}!`))
