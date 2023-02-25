import { UserDatabase } from "../database/UserDatabase"
import { SignupInputDTO, SignupOutputDTO } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { Users } from "../models/Users";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { TokenPayload, USER_ROLES } from "../types";

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

        const newUser = new Users(
            this.idGenerator.generate(),
            name,
            email,
            password,
            USER_ROLES.NORMAL, 
            new Date().toISOString()
        )

        const userDB = newUser.toDBModel()

        await this.userDatabase.insert(userDB)

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
}