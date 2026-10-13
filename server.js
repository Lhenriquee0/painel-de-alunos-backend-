const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');
//Middlewares
app.use(cors()); //Permite requisições de outras origens
app.use(express.json()); //Permite receber ddados em formato JSON
app.use(express.static(path.join(__dirname, 'public'))); // Serve os arquivos do frontend

// Função auxiliar para ler o banco de dados do arquivo JSON
function lerBancoDeDados() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ alunos: [] }, null, 2));
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
}

// Função auxiliar para salvar no banco deb dados
function salvarBancoDeDados(dados) {
    fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2));
    // nill, 2 serve para deixar o JSON formatado e fácil de ler
}
//---ROTAS DA API (CRUD) ---

// CREATE (Criar - POST)
app.post('/api/alunos', (req, res) => {
    const { nome, email, curso, cpf, telefone, endereco } = req.body;

    //Validação simples
    if (!nome || !email || !curso || !cpf || !telefone || !endereco) {
        return res.status(400).
        json({ erro: "Todos os campos são obrigatórios!"})
    }

    const db = lerBancoDeDados();

    // calcula o próximo ID
    const nextId = db.alunos.length > 0 ?
    Math.max(...db.alunos.map(a => a.id)) + 1 : 1;

    const novoAluno = {
        id: nextId,
        nome,
        email,
        curso,
        cpf,
        telefone,
        endereco,
        
        
    };
    db.alunos.push(novoAluno);
    salvarBancoDeDados(db); //Salva a alteração np arquivo db.json

    res.status(201).json(novoAluno);
});
// READ (Ler/Listar - GET)
app.get('/api/alunos', (req, res) => {
    const db = lerBancoDeDados();
    res.json(db.alunos);
});

// UPDATE (Atualizar - PUT)
app.put('/api/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, email, curso, cpf, telefone, endereco } = req.body;

    const db = lerBancoDeDados();
    const index = db.alunos.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(400).json({ erro: 'Alunos não encontrado!'});
    }

    db.alunos[index] = { ...db.alunos[index], nome, email, curso, cpf, telefone, endereco };
    salvarBancoDeDados(db); // Salva a alteração no arquivo 
    res.json(db.alunos[index]);
});

//Delete (Excluir - DELETE)
app.delete('/api/alunos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const db = lerBancoDeDados();
    const index = db.alunos.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(400).json({ erro: 'Alunos não encontrado!'});
    }

    db.alunos.splice(index, 1); // Remove o aluno da lista
    salvarBancoDeDados(db); // Salva a alteração no arquivo
    
    res.status(204).send(); 
});

// iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse http://localhost:${PORT}`);
    console.log(`Banco de dados local ativo no aquivo db.json`);
});