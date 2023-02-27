export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export interface UserDB {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string
}

export interface UserModel {
    id: string,
    name: string,
    email: string,
    password: string,
    role: USER_ROLES,
    createdAt: string
}

export interface PostsDB {
    id: string, 
    creator_id: string, 
    content: string, 
    likes: number, 
    dislikes: number, 
    created_at: string, 
    updated_at: string
}

export interface PostsWithCreatorsDB extends PostsDB {
    creator_name: string,
}

/* Criando o tipo PostsModel porque será retornado no FrontEnd: */

export interface PostsModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        name: string }
}

export interface TokenPayload {
    id: string,
	name: string,
    role: USER_ROLES
}
