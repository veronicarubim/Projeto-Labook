-- Active: 1677783473229@@127.0.0.1@3306

/* Criando a tabela users: */

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

/* Criando a tabela posts:  */

/* ON CASCADE nas chaves estrangeiras --> se algum user ja foi definido e ele criou uma playlist,
o usuário não pode ser deletado. Isso gera um problema caso precise ser feito edições.
Logo, seria necessário deletar manualmente. Para resolver isso, é só adicionar ON * CASCADE para que
todas as coisas criadas pelo usuário sejam deletadas ou atualizadas.*/


CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL, 
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

/* Criando a tabela de likes e dislikes: */

CREATE TABLE likes_dislikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

/* Populando as tabelas com dados mockados: */

INSERT INTO users (id, name, email, password, role)
VALUES 
("u001", "jaskier", "jaskier@gmail.com", "$2a$12$jcZnGm89L4x7vplos/5YXOlbGifBUlzRgrcvefYdMWMfOIPk4ky/2", "NORMAL"),
("u002", "veronica", "veronica@gmail.com", "123456", "NORMAL"),
("u003", "marco", "marco@gmail.com", "123456", "NORMAL");

INSERT INTO posts (id, creator_id, content)
VALUES 
("p001", "u001", "Eu sou um gato e me chamo Jaskier"),
("p002", "u002", "Eu sou bióloga"),
("p003", "u003", "Eu sou veterinário");

INSERT INTO likes_dislikes (user_id, post_id, like)
VALUES
("u001", "p002", 1),
("u002", "p002", 1),
("u001", "p001", 1),
("u003", "p002", 0);

/* Para atualizar as tabelas */
UPDATE posts
SET likes = 2
WHERE id = "p001";


/* Para ver o que tem dentro das tabelas: */
SELECT * FROM users; 

SELECT * FROM posts; 

SELECT * FROM likes_dislikes;

SELECT 
    posts.id,
    posts.creator_id,
    posts.content,
    posts.likes,
    posts.dislikes, 
    posts.created_at,
    posts.updated_at,
    users.name AS creator_name
FROM posts
JOIN users
ON posts.creator_id = users.id;

/* Excluindo as tabelas caso dê algum bug: */

DROP TABLE users; 

DROP TABLE posts; 

DROP TABLE likes_dislikes;



/* Comando para limpar as tabelas */

DELETE FROM likes_dislikes;

DELETE FROM posts; 

DELETE FROM users; 