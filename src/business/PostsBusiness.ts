import { PostsDatabase } from "../database/PostsDatabase";
import { CreatePostsInputDTO, DeletePostsInputDTO, EditPostsInputDTO, GetPostsInputDTO, GetPostsOutputDTO, LikeOrDislikePostsInputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Posts } from "../models/Posts";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { LikeDislikeDB, PostsDB, PostsWithCreatorsDB, POST_LIKE, USER_ROLES } from "../types";

export class PostsBusiness {
    constructor (
        private postsDatabase: PostsDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
        
    ) {}

    /* Transformar os users mockados em tokenID */

    public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {
        const {token} = input
        if (!token) {
            throw new BadRequestError("Token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (!payload === null) {
            throw new BadRequestError("Token inválido")
        }

        const postsWithCreatorsDB: PostsWithCreatorsDB[] 
        = await this.postsDatabase
            .getPostsWithCreators()

            console.log(postsWithCreatorsDB)

        const posts = postsWithCreatorsDB.map(
            (postsWithCreatorsDB) => {
                const posts = new Posts(
                    postsWithCreatorsDB.id,
                    postsWithCreatorsDB.content,
                    postsWithCreatorsDB.likes,
                    postsWithCreatorsDB.dislikes,
                    postsWithCreatorsDB.created_at,
                    postsWithCreatorsDB.updated_at,
                    postsWithCreatorsDB.creator_id,
                    postsWithCreatorsDB.creator_name
                )

                return posts.toBusinessModel()
                
        })

        const output: GetPostsOutputDTO = posts

        return output
        
    }

    public createPosts = async (input: CreatePostsInputDTO): Promise<void> => {
        const { token, content} = input

        /* validando token */

        if (!token) {
            throw new BadRequestError("Token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("Token inválido")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser uma string")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()
        const creatorId = payload.id
        const creatorName = payload.name

        const posts = new Posts(
            id, 
            content,
            0,
            0,
            createdAt,
            updatedAt,
            creatorId,
            creatorName,
        )

        const postsDB = posts.toDBModel()
        console.log(postsDB)

       await this.postsDatabase.insert(postsDB)
        
    }

    public editPosts = async (input: EditPostsInputDTO): Promise<void> => {
        const { idToEdit, token, content} = input

        if (!token) {
            throw new BadRequestError("Token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("Token inválido.")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("Conteúdo deve ser uma string.")
        }

        const postsDB: PostsDB | undefined = 
        await this.postsDatabase.findById(idToEdit)

        if (!postsDB) {
            throw new NotFoundError("id não encontrado.")
        }

        const creatorId = payload.id
        if (postsDB.creator_id !== payload.id) {
            throw new BadRequestError("Somente o criador do post pode editá-lo.")
        }

        const creatorName = payload.name

        const posts = new Posts(
            postsDB.id, 
            postsDB.content,
            postsDB.likes,
            postsDB.dislikes,
            postsDB.created_at,
            postsDB.updated_at,
            creatorId,
            creatorName,
        )

        posts.setContent(content)
        posts.setUpdatedAt(new Date().toISOString())

        const newPostsDB = posts.toDBModel()

        await this.postsDatabase.update(idToEdit, newPostsDB)
          
    }

    public deletePosts = async (
        input: DeletePostsInputDTO): Promise<void> => {
        const {idToDelete, token} = input

        if (token === undefined) {
            throw new BadRequestError("Token ausente")
        }

        if (!token) {
            throw new BadRequestError("Token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("Token inválido.")
        }

        const postsDB = await this.postsDatabase.findById(idToDelete)
        
        if (!postsDB) {
            throw new NotFoundError("id não encontrado")
        }

        const creatorId = payload.id

        if (payload.role !== USER_ROLES.ADMIN &&
            postsDB.creator_id !== creatorId) {
            throw new BadRequestError("Somente quem criou o post pode deletá-lo.")
        }

        await this.postsDatabase.delete(idToDelete)

        /* Para  que os admins consigam deletar os posts: */

    }

    public likeOrDislikePosts = async (
        input: LikeOrDislikePostsInputDTO): Promise<void> => {
        const {idToLikeOrDislike, token, like} = input

        if (token === undefined) {
            throw new BadRequestError("Token ausente")
        }

        if (!token) {
            throw new BadRequestError("Token ausente")
        }

        const payload = this.tokenManager.getPayload(token)

        if (payload === null) {
            throw new BadRequestError("Token inválido.")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("Like deve ser boolean")
        }

        const postsWithCreatorsDB = await this.postsDatabase
        .findPostsWithCreatorsById(idToLikeOrDislike)
        
        if (!postsWithCreatorsDB) {
            throw new NotFoundError("id não encontrado")
        }

        const userId = payload.id
        const likeSQL = like? 1 : 0

        const LikeDislikeDB: LikeDislikeDB = {
            user_id: userId,
            post_id: postsWithCreatorsDB.id,
            like: likeSQL
        }

        const post = new Posts (
            postsWithCreatorsDB.id, 
            postsWithCreatorsDB.content,
            postsWithCreatorsDB.likes,
            postsWithCreatorsDB.dislikes,
            postsWithCreatorsDB.created_at,
            postsWithCreatorsDB.updated_at,
            postsWithCreatorsDB.creator_id,
            postsWithCreatorsDB.creator_name,
        )

        const postLikeOrDislike = await this.postsDatabase
        .findLikeDislike(LikeDislikeDB)

        if (postLikeOrDislike === POST_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.postsDatabase.removeLikeDislike(LikeDislikeDB)
                post.removeLike()
            } else {
                await this.postsDatabase.updateLikeDislike(LikeDislikeDB)
                post.removeLike()
                post.addDislike
            }

        } else if (postLikeOrDislike === POST_LIKE.ALREADY_DISLIKED) {

            if (like) {
                await this.postsDatabase.updateLikeDislike(LikeDislikeDB)
                post.removeDislike()
                post.addLike()
            } else {
                await this.postsDatabase.removeLikeDislike(LikeDislikeDB)
                post.removeLike()
                post.addDislike()
            } 

        } else {
            
            await this.postsDatabase.likeOrDislikePost(LikeDislikeDB)

        if (like) {
            post.addLike
        } else {
            post.addDislike
        }

    } 

        const updatePostDB = post.toDBModel()

        await this.postsDatabase.update(idToLikeOrDislike, updatePostDB)

    }

}