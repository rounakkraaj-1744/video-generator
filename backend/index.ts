import express from "express"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config ()

import generationRoute from "./src/modules/generation/generation.route"

const app = express()
const port = process.env.port || 3000;

app.use (cors())
app.use (express.json())

app.use ("/api", generationRoute);

app.listen (port, ()=>console.log ("Server start at port 3000"))