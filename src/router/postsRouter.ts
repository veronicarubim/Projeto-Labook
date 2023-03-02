import express from 'express'
import { PostsBusiness } from '../business/PostsBusiness'
import { PostsController } from '../controller/PostsController'
import { PostsDatabase } from '../database/PostsDatabase'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'

export const postsRouter = express.Router()

const postsController = new PostsController(
    new PostsBusiness(
        new PostsDatabase(),
        new IdGenerator(),
        new TokenManager()

    )
) 

postsRouter.get("/", postsController.getPosts)
postsRouter.post("/", postsController.createPosts)

/* Nesse caso, como é preciso que somente o dono do posts faça a edição, o params vem :id */
postsRouter.put("/:id", postsController.editPosts)
postsRouter.delete("/:id", postsController.deletePosts)
postsRouter.put("/:id/like", postsController.likeOrDislikePosts)