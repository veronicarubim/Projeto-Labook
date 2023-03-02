import { Posts } from "../models/Posts";
import { LikeDislikeDB, PostsDB, PostsWithCreatorsDB, POST_LIKE } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostsDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    public async findPostById(id: string) {
        
        const [postDB]: PostsDB[] | undefined[] = await BaseDatabase
        .connection(PostsDatabase.TABLE_POSTS)
        .where({id})

        return postDB
    }

    public getPostsWithCreators = async () => {
        const result: PostsWithCreatorsDB[] = await BaseDatabase
        .connection(PostsDatabase.TABLE_POSTS)
        .select(
            "posts.id",
            "posts.creator_id",
            "posts.content",
            "posts.likes",
            "posts.dislikes", 
            "posts.created_at",
            "posts.updated_at",
            "users.name AS creator_name",
        )
        .join("users","posts.creator_id","=","users.id")

        return result
        
    } 

    public insert = async (postsDB: PostsDB): Promise<void> => {
        await BaseDatabase
        .connection(PostsDatabase.TABLE_POSTS)
        .insert(postsDB)
    }

    public findById = async (id: string): Promise<PostsDB | undefined> => {
        const result: PostsDB[] = await BaseDatabase
        .connection(PostsDatabase.TABLE_POSTS)
        .select()
        .where({id})

        return result[0]
    }

    public update = async (id: string, postsDB: PostsDB): Promise<void> => {
        await BaseDatabase.connection(PostsDatabase.TABLE_POSTS)
        .update(postsDB)
        .where({id})
    }

    public delete = async (id: string): Promise<void> => {
        await BaseDatabase.connection(PostsDatabase.TABLE_POSTS)
        .delete()
        .where({id})
    }

    public likeOrDislikePost = async (likeDislike: LikeDislikeDB): Promise<void> => {
        await BaseDatabase.connection(PostsDatabase.TABLE_LIKES_DISLIKES)
        .insert(likeDislike)
    }

    public findPostsWithCreatorsById = async (postsId: string
        ): Promise<PostsWithCreatorsDB | undefined> => {
        const result: PostsWithCreatorsDB[] = await BaseDatabase
        .connection(PostsDatabase.TABLE_POSTS)
        .select(
            "posts.id",
            "posts.creator_id",
            "posts.content",
            "posts.likes",
            "posts.dislikes", 
            "posts.created_at",
            "posts.updated_at",
            "users.name AS creator_name",
        )
        .join("users","posts.creator_id","=","users.id")
        .where(`id = '${postsId}'`)

        return result[0]
        
    } 

    public findLikeDislike = async (
        likeDislikeDBToFind: LikeDislikeDB): Promise<POST_LIKE | null> => {
            const [likeDislikeDB]: LikeDislikeDB[] = await BaseDatabase
            .connection(PostsDatabase.TABLE_LIKES_DISLIKES)
            .select()
            .where({user_id: likeDislikeDBToFind.user_id,
                    post_id: likeDislikeDBToFind.post_id
            })

            if (likeDislikeDB) {
                return likeDislikeDB.like === 1 ? POST_LIKE.ALREADY_LIKED : POST_LIKE.ALREADY_DISLIKED
            } else {
                return null
            }
            
        }

    public removeLikeDislike = async (
        likeDislikeDB: LikeDislikeDB): Promise<void> => {
            await BaseDatabase.connection(PostsDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({
                user_id: likeDislikeDB.user_id,
                post_id: likeDislikeDB.post_id
            })
    }

    public removeLike = async (
        likeDislikeDB: LikeDislikeDB): Promise<void> => {
            await BaseDatabase.connection(PostsDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({
                user_id: likeDislikeDB.user_id,
                post_id: likeDislikeDB.post_id
            })
    }
    
    public updateLikeDislike = async (
        likeDislikeDB: LikeDislikeDB): Promise<void> => {
            await BaseDatabase.connection(PostsDatabase.TABLE_LIKES_DISLIKES)
            .update(likeDislikeDB)
            .where({
                user_id: likeDislikeDB.user_id,
                post_id: likeDislikeDB.post_id
            })
    }
    
    
}