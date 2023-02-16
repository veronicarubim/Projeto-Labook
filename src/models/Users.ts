// Criando a classe com os constructors do Users

export class Users {
    constructor(
        private id: string,
        private name: string,
        private email: string,
        private password: string,
        private role: string,
        private createdAt: string
    ) {}

// Os métodos 'get' e 'set' acessam e alteram/inserem informações da classe. 

    // Para ID

    public getId(): string {
        return this.id
    }

    public setId(value: string): void {
        this.id = value
    }

    // Para Name

    public getName(): string {
        return this.name
    }

    public setName(value: string): void {
        this.name = value
    }

    // Para E-mail

    public getEmail(): string {
        return this.email
    }

    public setEmail(value: string): void {
        this.email = value
    }

    // Para Password

    public getPassword(): string {
        return this.password 
    }

    public setPassword(value: string): void {
        this.password = value
    }

    // Para role

    public getRole(): string {
        return this.role
    }

    public setRole(value: string): void {
        this.role = value
    }

    // Para Created_at

    public getCreatedAt(): string {
        return this.createdAt 
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

};