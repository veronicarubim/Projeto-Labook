// Criando a classe com os constructors da tabela Users

export class Posts {
    constructor(
        private id: string, 
        private creatorId: string, 
        private content: string, 
        private likes: boolean, 
        private dislikes: boolean, 
        private createdAt: string, 
        private updatedAt: string
    ) {}

    public getId(): string {
        return this.id
    }

    public setId(value: string): void {
        this.id = value
    }

    public getcreatorId(): string {
        return this.creatorId
    }

    public setcreatorId(value: string): void {
        this.creatorId = value
    }

    public getContent(): string {
        return this.content
    }

    public setContent(value: string): void {
        this.content = value
    }

    public getLikes(): boolean {
        return this.likes
    }

    public setLikes(value: boolean): void {
        this.likes = value
    }

    public getDislikes(): boolean {
        return this.dislikes
    }

    public setDislikes(value: boolean): void {
        this.dislikes = value
    }

    public getUpdatedAt(): string {
        return this.updatedAt
    }

    public setUpdatedAt(value: string): void {
        this.updatedAt = value
    }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

};