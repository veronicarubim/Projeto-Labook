import { PostsModel } from "../types"

/* DTOS --> (Data Transfer Object) são usados para definir 
o formato e o tipo dos dados que são transferidos entre diferentes 
partes do sistema.

Em resumo, DTOs no TypeScript são usados para definir o formato e o 
tipo dos dados que são transferidos entre diferentes partes do sistema, 
permitindo que as informações sejam transmitidas de forma clara e eficiente.*/


// ENDPOINTS: 

/* Signup */

  export interface SignupInputDTO {
    name: unknown,
    email: unknown,
    password: unknown
  }

  export interface SignupOutputDTO {
    token: string
  }

/* Login  */

  export interface LoginInputDTO {
    email: unknown,
    password: unknown
  }

  export interface LoginOutputDTO {
    token: string
  }

/* Get Posts */

  export interface GetPostsInputDTO {
    token: string | undefined
  }

  export type GetPostsOutputDTO = PostsModel[]

/* Create Posts */

  export interface CreatePostsInputDTO {
    token: string | undefined
  }

/* Edit Posts */

  /* As coisas que vem do path params são sempre do tipo String */
  export interface EditPostsInputDTO {
    idToEdit: string,
    token: string | undefined,
    name: unknown
  }

/* Delete Posts */

  export interface DeletePostsInputDTO {
    idToEdit: string,
    token: string | undefined,
    name: unknown
  }

/* Like ou Dislike Posts */

  export interface LikeOrDislikePostsInputDTO {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
  }

  /* Endpoints que não pedem uma resposta do backend (como retornar uma lista etc) 
  não precisam de um output do DTO. */