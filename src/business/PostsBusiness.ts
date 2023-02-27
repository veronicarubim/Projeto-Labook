import { PostsDatabase } from "../database/PostsDatabase";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { Posts } from "../models/Posts";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { PostsWithCreatorsDB } from "../types";

export class PostsBusiness {
    constructor (
        private postsDatabase: PostsDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
        
    ) {}

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
}