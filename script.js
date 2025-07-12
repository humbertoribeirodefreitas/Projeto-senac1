// Estado da aplicação
let currentUser = null;
let alunos = [];

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    setupEventListeners();
    formatCPFInputs();
});

// Verificar sessão do usuário
async function checkSession() {
    try {
        const response = await fetch('/api/check-session');
        const data = await response.json();
        
        if (data.logged_in) {
            currentUser = data.user;
            showMainApp();
        } else {
            showLoginPage();
        }
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        showLoginPage();
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Cadastrar form
    const cadastrarForm = document.getElementById('cadastrarForm');
    if (cadastrarForm) {
        cadastrarForm.addEventListener('submit', handleCadastrar);
    }

    // Buscar form
    const buscarForm = document.getElementById('buscarForm');
    if (buscarForm) {
        buscarForm.addEventListener('submit', handleBuscar);
    }

    // Editar form
    const editarForm = document.getElementById('editarForm');
    if (editarForm) {
        editarForm.addEventListener('submit', handleEditar);
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Home link
    const homeLink = document.getElementById('homeLink');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('home');
        });
    }

    // Password suggestions
    const suggestions = document.querySelectorAll('.suggestion');
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            document.getElementById('password').value = this.textContent;
        });
    });
}

// Formatação de CPF
function formatCPFInputs() {
    const cpfInputs = document.querySelectorAll('input[name="cpf"]');
    cpfInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    });
}

// Mostrar página de login
function showLoginPage() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('loginPage').classList.add('active');
    document.querySelector('.header').style.display = 'none';
    document.querySelector('.footer').style.display = 'block';
}

// Mostrar aplicação principal
function showMainApp() {
    document.querySelector('.header').style.display = 'block';
    showPage('home');
}

// Navegação entre páginas
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Carregar dados específicos da página
        if (pageName === 'listar') {
            loadAlunos();
        }
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        username: formData.get('username'),
        senha: formData.get('password')
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            showAlert('Login realizado com sucesso!', 'success');
            setTimeout(() => {
                showMainApp();
            }, 1000);
        } else {
            showAlert(data.error || 'Erro no login', 'danger');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        showAlert('Erro de conexão', 'danger');
    }
}

// Handle Logout
async function handleLogout(e) {
    e.preventDefault();
    
    try {
        await fetch('/api/logout', { method: 'POST' });
        currentUser = null;
        showAlert('Logout realizado com sucesso!', 'info');
        setTimeout(() => {
            showLoginPage();
        }, 1000);
    } catch (error) {
        console.error('Erro no logout:', error);
    }
}

// Handle Cadastrar Aluno
async function handleCadastrar(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const alunoData = {
        nome: formData.get('nome'),
        cpf: formData.get('cpf'),
        curso: formData.get('curso'),
        status: formData.get('status'),
        periodo: formData.get('periodo'),
        turno: formData.get('turno')
    };

    // Validações
    if (!validateCPF(alunoData.cpf)) {
        showAlert('CPF inválido', 'danger');
        return;
    }

    try {
        const response = await fetch('/api/alunos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alunoData)
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Aluno cadastrado com sucesso!', 'success');
            e.target.reset();
            setTimeout(() => {
                showPage('listar');
            }, 1500);
        } else {
            showAlert(data.error || 'Erro ao cadastrar aluno', 'danger');
        }
    } catch (error) {
        console.error('Erro ao cadastrar aluno:', error);
        showAlert('Erro de conexão', 'danger');
    }
}

// Handle Buscar Aluno
async function handleBuscar(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const searchParams = new URLSearchParams();
    
    const nome = formData.get('nome');
    const cpf = formData.get('cpf');
    const curso = formData.get('curso');
    
    if (nome) searchParams.append('nome', nome);
    if (cpf) searchParams.append('cpf', cpf);
    if (curso) searchParams.append('curso', curso);

    try {
        const response = await fetch(`/api/alunos/search?${searchParams}`);
        const data = await response.json();

        if (response.ok) {
            alunos = data;
            showPage('listar');
            renderAlunosTable();
        } else {
            showAlert('Erro na busca', 'danger');
        }
    } catch (error) {
        console.error('Erro na busca:', error);
        showAlert('Erro de conexão', 'danger');
    }
}

// Handle Editar Aluno
async function handleEditar(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const alunoId = formData.get('id');
    const alunoData = {
        nome: formData.get('nome'),
        cpf: formData.get('cpf'),
        curso: formData.get('curso'),
        status: formData.get('status'),
        periodo: formData.get('periodo'),
        turno: formData.get('turno')
    };

    // Validações
    if (!validateCPF(alunoData.cpf)) {
        showAlert('CPF inválido', 'danger');
        return;
    }

    try {
        const response = await fetch(`/api/alunos/${alunoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alunoData)
        });

        const data = await response.json();

        if (response.ok) {
            showAlert('Aluno atualizado com sucesso!', 'success');
            setTimeout(() => {
                showPage('listar');
            }, 1500);
        } else {
            showAlert(data.error || 'Erro ao atualizar aluno', 'danger');
        }
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        showAlert('Erro de conexão', 'danger');
    }
}

// Carregar lista de alunos
async function loadAlunos() {
    try {
        const response = await fetch('/api/alunos');
        const data = await response.json();

        if (response.ok) {
            alunos = data;
            renderAlunosTable();
        } else {
            showAlert('Erro ao carregar alunos', 'danger');
        }
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        showAlert('Erro de conexão', 'danger');
    }
}

// Renderizar tabela de alunos
function renderAlunosTable() {
    const tbody = document.getElementById('alunosTableBody');
    
    if (alunos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum aluno encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = alunos.map(aluno => `
        <tr>
            <td>${aluno.nome}</td>
            <td>${aluno.curso}</td>
            <td>${aluno.matricula}</td>
            <td>${aluno.cpf}</td>
            <td>${aluno.status}</td>
            <td>${aluno.turno}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editarAluno(${aluno.id})">
                    ✏️
                </button>
            </td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="excluirAluno(${aluno.id})">
                    🗑️
                </button>
            </td>
        </tr>
    `).join('');
}

// Editar aluno
function editarAluno(id) {
    const aluno = alunos.find(a => a.id === id);
    if (!aluno) return;

    // Preencher formulário de edição
    document.getElementById('editarId').value = aluno.id;
    document.getElementById('editarNome').value = aluno.nome;
    document.getElementById('editarCpf').value = aluno.cpf;
    document.getElementById('editarCurso').value = aluno.curso;
    document.getElementById('editarStatus').value = aluno.status;
    document.getElementById('editarPeriodo').value = aluno.periodo;
    document.getElementById('editarTurno').value = aluno.turno;

    showPage('editar');
}

// Excluir aluno
async function excluirAluno(id) {
    const aluno = alunos.find(a => a.id === id);
    if (!aluno) return;

    if (!confirm(`Tem certeza que deseja excluir o aluno ${aluno.nome}?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/alunos/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showAlert('Aluno excluído com sucesso!', 'success');
            loadAlunos(); // Recarregar lista
        } else {
            showAlert('Erro ao excluir aluno', 'danger');
        }
    } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        showAlert('Erro de conexão', 'danger');
    }
}

// Validação de CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    if (parseInt(cpf.charAt(9)) !== digit1) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    return parseInt(cpf.charAt(10)) === digit2;
}

// Mostrar alertas
function showAlert(message, type) {
    // Remover alertas existentes
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // Criar novo alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    // Inserir no início do conteúdo principal
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(alert, mainContent.firstChild);

    // Remover após 5 segundos
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Funções globais para uso no HTML
window.showPage = showPage;
window.editarAluno = editarAluno;
window.excluirAluno = excluirAluno;

