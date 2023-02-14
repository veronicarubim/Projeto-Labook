import { PostsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostsDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"

    public async findPostById(id: string) {
        
        const [postDB]: PostsDB[] | undefined[] = await BaseDatabase
        .connection(PostsDatabase.TABLE_POSTS)
        .where({id})

        return postDB
    }
}