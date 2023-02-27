import { PostsDB, PostsWithCreatorsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostsDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"

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
        .join("posts.creator_id","=","users.id")

        return result
        
    } 
}