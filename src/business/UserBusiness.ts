import { UserDatabase } from "../database/UserDatabase"
import { LoginInputDTO, LoginOutputDTO, SignupInputDTO, SignupOutputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Users } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { TokenPayload, UserDB, USER_ROLES } from "../types";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        const {name, email, password} = input

        if (typeof name !== "string") {
            throw new BadRequestError("nome deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("e-mail deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("password deve ser string")
        }

        const id = this.idGenerator.generate()
        const hashedPassword = await this.hashManager.hash(password)
        const role = USER_ROLES.NORMAL
        const createdAt = new Date().toISOString()

        const newUser = new Users(
            id,
            name,
            email,
            hashedPassword,
            role,
            createdAt
        )

        const newUserDB = newUser.toDBModel()
        await this.userDatabase.insert(newUserDB)

        const payload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole(),
        }

        const token = this.tokenManager.createToken(payload)

        const output: SignupOutputDTO = {
            token
        }

        return output
    }

    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        const {email, password} = input

        if (typeof email !== "string") {
            throw new BadRequestError("e-mail deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("password deve ser string")
        }

        /* Conferindo no banco de dados se o usuário existe pelo endereço de e-mail */
        const userDB: UserDB | undefined = await this.userDatabase.findByEmail(email)

        if (!userDB) {
            throw new NotFoundError("'email' não cadastrado")
        }

        const user = new Users(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        )

        /* Conferindo se a senha está correta */

        const hashedPassword = user.getPassword()

        const isPasswordCorrect = await this.hashManager
        .compare(password, hashedPassword)

        if (!isPasswordCorrect) {
            throw new BadRequestError ('Senha incorreta')
        }

        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token = this.tokenManager.createToken(payload)

        const output: LoginOutputDTO = {
            token
        }

        return output
    }
}