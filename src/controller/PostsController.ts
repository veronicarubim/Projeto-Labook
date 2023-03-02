import { Request, Response } from "express";
import { PostsBusiness } from "../business/PostsBusiness";
import { CreatePostsInputDTO, DeletePostsInputDTO, EditPostsInputDTO, GetPostsInputDTO, LikeOrDislikePostsInputDTO } from "../dtos/userDTO";
import { BaseError } from "../errors/BaseError";

export class PostsController {
    constructor(
        private postsBusiness: PostsBusiness
    ) {}

    public getPosts = async (req: Request, res: Response) => {
        try { 
            const input: GetPostsInputDTO = {
                token: req.headers.authorization
            }

            const output = await this.postsBusiness.getPosts(input)
        
            res.status(200).send(output)
            

        } catch (error) {
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro Inesperado")
            }
        }
    }

    public createPosts = async (req: Request, res: Response) => {
        try {
            const input: CreatePostsInputDTO = {
                token: req.headers.authorization,
                content: req.body.content
            }

            await this.postsBusiness.createPosts(input)

            res.status(201).send("Post criado com sucesso").end()

        } catch (error) {
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro Inesperado")
            }
        }
    }

    public editPosts = async (req: Request, res: Response) => {
        try {
           const input: EditPostsInputDTO = {
            idToEdit: req.params.id,
            token: req.headers.authorization,
            content: req.body.content
           }

            await this.postsBusiness.editPosts(input)

            res.status(200).end().send("Post editado com sucesso")

        } catch (error) {
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro Inesperado")
            }
        }
    }

    public deletePosts = async (req: Request, res: Response) => {
      try {
        const input: DeletePostsInputDTO = {
            idToDelete: req.params.id,
            token: req.headers.authorization
        }

        await this.postsBusiness.deletePosts(input)

        res.status(200).end().send("Deletado com sucesso")
      
        }  catch (error) {
        if (error instanceof BaseError) {
            res.status(error.statusCode).send(error.message)
        } else {
            res.status(500).send("Erro Inesperado")
        }
    }
    }

    public likeOrDislikePosts = async (req: Request, res: Response) => {
        try {
            const input: LikeOrDislikePostsInputDTO = {
                idToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }

            await this.postsBusiness.likeOrDislikePosts(input)
            res.status(200).end()
            
          }  catch (error) {
          if (error instanceof BaseError) {
              res.status(error.statusCode).send(error.message)
          } else {
              res.status(500).send("Erro Inesperado")
          }
      }
    }
}

