const API_URL = 'http://localhost:3000/api/alunos';

const form = document.getElementById('aluno-form');
const tbody = document.getElementById('aluno-tbody');
const btnCancel = document.getElementById('btn-cancel');
const btnSave = document.getElementById('btn-save');

// Campos do formulário
const inputId = document.getElementById('aluno-id');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputCurso = document.getElementById('curso');
const inputCpf = document.getElementById('cpf');
const inputTelefone = document.getElementById('telefone');
const inputEndereco = document.getElementById('endereco');

// Estado local
let editandoId = null;


// ==========================================
// 1. READ - Buscar alunos
// ==========================================

async function carregarAlunos() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Erro ao buscar alunos');
        }

        const alunos = await response.json();

        tbody.innerHTML = '';

        if (alunos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">
                        Nenhum aluno cadastrado.
                    </td>
                </tr>
            `;
            return;
        }

        alunos.forEach(aluno => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.cpf}</td>
                <td>${aluno.telefone}</td>
                <td>${aluno.endereco}</td>
                <td>${aluno.curso}</td>
                <td class="actions">
                    <button 
                        class="btn-icon btn-edit"
                        onclick="iniciarEdicao(${aluno.id})">
                        Editar
                    </button>

                    <button 
                        class="btn-icon btn-delete"
                        onclick="deletarAluno(${aluno.id})">
                        Excluir
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        alert('Erro ao conectar com o servidor!');
    }
}


// ==========================================
// 2. CREATE / UPDATE
// ==========================================

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const aluno = {
        nome: inputNome.value.trim(),
        email: inputEmail.value.trim(),
        curso: inputCurso.value,
        cpf: inputCpf.value.trim(),
        telefone: inputTelefone.value.trim(),
        endereco: inputEndereco.value.trim()
    };

    try {

        // UPDATE
        if (editandoId !== null) {

            const response = await fetch(`${API_URL}/${editandoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(aluno)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar aluno');
            }

            alert('Aluno atualizado com sucesso!');

        } 
        
        // CREATE
        else {

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(aluno)
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar aluno');
            }

            alert('Aluno cadastrado com sucesso!');
        }

        resetarFormulario();
        carregarAlunos();

    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar os dados no servidor!');
    }
});


// ==========================================
// 3. EDITAR ALUNO
// ==========================================

async function iniciarEdicao(id) {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Erro ao buscar alunos');
        }

        const alunos = await response.json();

        const aluno = alunos.find(a => a.id === id);

        if (!aluno) {
            alert('Aluno não encontrado!');
            return;
        }

        editandoId = aluno.id;

        inputId.value = aluno.id;
        inputNome.value = aluno.nome;
        inputEmail.value = aluno.email;
        inputCpf.value = aluno.cpf;
        inputTelefone.value = aluno.telefone;
        inputEndereco.value = aluno.endereco;
        inputCurso.value = aluno.curso;

        btnSave.textContent = 'Atualizar Aluno';
        btnCancel.style.display = 'inline-block';

        inputNome.focus();

    } catch (error) {
        console.error('Erro ao iniciar edição:', error);
        alert('Erro ao carregar aluno para edição!');
    }
}


// ==========================================
// 4. CANCELAR EDIÇÃO
// ==========================================

btnCancel.addEventListener('click', () => {
    resetarFormulario();
});


// ==========================================
// 5. RESETAR FORMULÁRIO
// ==========================================

function resetarFormulario() {

    form.reset();

    inputId.value = '';

    editandoId = null;

    btnSave.textContent = 'Salvar Aluno';

    btnCancel.style.display = 'none';
}


// ==========================================
// 6. DELETE - Excluir aluno
// ==========================================

async function deletarAluno(id) {

    const confirmar = confirm(
        'Tem certeza que deseja excluir este aluno?'
    );

    if (!confirmar) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir aluno');
        }

        alert('Aluno excluído com sucesso!');

        carregarAlunos();

    } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir o aluno!');
    }
}


// ==========================================
// 7. CARREGAR ALUNOS AO ABRIR A PÁGINA
// ==========================================

carregarAlunos();
