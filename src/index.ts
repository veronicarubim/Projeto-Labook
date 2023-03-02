import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './router/userRouter'
import { postsRouter } from './router/postsRouter'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT)}`)
})

app.use("/users", userRouter)
app.use("/posts", postsRouter)

/* Fluxo de lógica: index > router > controller (requisições) > depois business (regras e verificações) e DTOs com as formas de input e output */