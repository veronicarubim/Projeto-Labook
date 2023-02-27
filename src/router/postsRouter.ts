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