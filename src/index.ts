import express from "express";
import cors from "cors";
import { userRouter } from "./router/userRouter";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(Number(process.env.PORT), () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT)}`)
})

app.use("/users", userRouter)

// Endpoints 

/* 
signup
login
get posts
create post
edit post
delete post
like / dislike post 
*/