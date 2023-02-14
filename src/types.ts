export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: string,
    created_at: string
}

export interface PostsDB {
    id: string, 
    creator_id: string, 
    content: string, 
    likes: boolean, 
    dislikes: boolean, 
    created_at: string, 
    updated_at: string
}