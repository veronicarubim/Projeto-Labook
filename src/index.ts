import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});

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