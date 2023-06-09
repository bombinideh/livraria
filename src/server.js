import express from "express";
import { database } from "./knex.js";

const app = express();

app.use(express.json());

//routes

//all users
app.get("/usuario", async (req, res) => {
  try {
    const rows = await database("usuarios").select(
      "id",
      "nome",
      "email",
      "senha"
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
});
//one user
//async : para deixar de forma sincrona, como promises. ela faz o await funcionar.
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await database("usuarios")
      .where({ id })
      .select("*")
      .first();

    if (!usuario) {
      return res.status(400).json({ message: "Usuario nao existente" });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    //nao consologar o erro, informacoes sensiveis
    console.error(error);
    return res.status(500).end();
  }
});
// Incluir Usuario
app.post("/usuario", async (req, res) => {
  try {
    const input = req.body;
    const exist = await database("usuarios")
      .where({ email: input["email"] })
      .first("id");

    if (exist) {
      return res.status(400).json({ message: "Esse usuário já existe" });
    }

    const novo = await database("usuarios").insert(input, "id");
    return res.status(201).json(novo);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});
//alterar Usuario
app.patch("/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const exist = await database("usuarios").where({ id }).select("*").first();

    if (!exist) {
      return res.status(400).json({ message: `Usuario ${id} nao encontrado` });
    }

    const input = req.body;

    const update = await database("usuarios").where({ id }).update(input, "*");

    return res.status(201).json({ update });
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});

// criar rota receber usuario e senha, verificar se existe o usuario e senha
// se existir responder um OK
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const exist = await database("usuarios")
      .where({ email })
      .first("id", "senha", "tentativas");

    if (!exist) {
      return res.status(400).json({ message: "usuario ou senha invalidos" });
    }

    if (exist.senha !== senha) {
      await database("usuarios")
        .where("id", exist.id)
        .update({ tentativas: exist.tentativas + 1 });

      return res.status(400).json({ message: "usuario ou senha invalidos" });
    }

    if (exist.tentativas > 4) {
      return res.status(401).json({ message: "Usuario bloqueado" });
    }
    await database("usuarios").where("id", exist.id).update({ tentativas: 0 });
    return res.status(201).json({ message: "OK" });
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});

app.post("/desbloquear-usuario", async (req, res) => {
  try {
    const { email } = req.body;

    const exist = await database("usuarios").where({ email }).first("id");

    if (!exist) {
      return res.status(400).json({ message: "usuario nao existe" });
    }

    await database("usuarios").where("id", exist.id).update({ tentativas: 0 });

    return res.status(201).json({ message: "usuario desbloqueado" });
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});
app.get("/livros", async (req, res) => {
  try {
    const rows = await database("livros").select(
      "id",
      "titulo",
      "preco",
      "qtd_pag"
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});
app.get("/livros/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const livros = await database("livros").where({ id }).select("*").first();
    if (!livros) {
      return res
        .status(400)
        .json({ message: `Livro com o id ${id} não existe!` });
    }
    return res.status(201).json(livros);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});
const postLivros = async (req, res, next) => {
  const input = req.body;
  const exist = await database("livros")
    .where({ titulo: input["titulo"] })
    .first("id");

  if (exist) {
    return res.status(400).json({ message: "Esse livro já existe" });
  }
  const novo = await database("livros").insert(input, "id");
  return res.status(201).json({ message: "Livro cadastrado com sucesso" });
};
app.post("/livros", async (req, res, next) => {
  try {
    return await postLivros(req, res, next);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});

const patchLivros = async (req, res, next) => {};

const endpoint = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
};

app.patch(
  "/livros/:id",
  endpoint(async (req, res, next) => {
    const { id } = req.params;
    const exist = await database("livros").where({ id });

    if (!exist) {
      return res
        .status(400)
        .json({ message: `Livro com o id ${id} não encontrado` });
    }
    const input = req.body;

    const update = await database("livros").where({ id }).update(input, "*");
    return res.status(201).json(update);
  })
);

app.get("/clientes", async (req, res) => {
  try {
    const rows = await database("clientes").select("id", "nome", "cpf");
    return res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});

app.get("/clientes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const clientes = await database("clientes").where({ id }).select().first();

    if (!clientes) {
      return res
        .status(400)
        .json({ message: `Não existe cliente com o id ${id}.` });
    }
    return res.status(201).json(clientes);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});
app.post("/clientes", async (req, res) => {
  try {
    const input = req.body;
    const exist = await database("clientes")
      .where({ cpf: input["cpf"] })
      .first("id");

    if (exist) {
      return res.status(400).json({ message: "Esse cliente já existe" });
    }
    const novo = await database("clientes").insert(input, "id");
    return res.status(201).json("Cliente cadastrado com sucesso!");
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});
app.patch("/clientes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const exist = await database("clientes").where({ id }).first();

    if (!exist) {
      return res.status(400).json({ message: `Cliente ${id} não encontrado` });
    }
    const input = req.body;

    const update = await database("clientes").where({ id }).update(input, "*");

    return res.status(201).json({ update });
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});

app.post("/emprestimo-livro", async (req, res) => {
  try {
    const { livros, ...input } = req.body;
    input = await database("emprestimos");
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});
app.listen(5008);
