# Sistema de Gestão de Alunos - SENAC

Sistema web completo para gerenciamento de alunos do SENAC, desenvolvido com Flask (backend) e HTML/CSS/JavaScript (frontend).

## 🚀 Funcionalidades

- **Autenticação**: Sistema de login seguro
- **Cadastro de Alunos**: Formulário completo para inserir novos alunos
- **Listagem de Alunos**: Visualização em tabela com todos os alunos cadastrados
- **Edição de Alunos**: Atualização de dados dos alunos existentes
- **Exclusão de Alunos**: Remoção de alunos do sistema
- **Busca de Alunos**: Pesquisa por nome, CPF ou curso
- **Design Responsivo**: Interface adaptável para desktop e mobile

## 📋 Campos do Aluno

- Nome completo
- CPF (com validação)
- Matrícula (gerada automaticamente)
- Curso (ADMINISTRAÇÃO, GTI, RH, ADS)
- Status (ATIVO/INATIVO)
- Período (PRIMEIRO, SEGUNDO, TERCEIRO)
- Turno (Matutino, Vespertino, Noturno)

## 🛠️ Tecnologias Utilizadas

### Backend
- **Flask**: Framework web Python
- **SQLAlchemy**: ORM para banco de dados
- **SQLite**: Banco de dados
- **Flask-CORS**: Suporte a CORS

### Frontend
- **HTML5**: Estrutura das páginas
- **CSS3**: Estilização e design responsivo
- **JavaScript**: Interatividade e comunicação com API

## 📦 Instalação

### Pré-requisitos
- Python 3.11+
- pip (gerenciador de pacotes Python)

### Passos para instalação

1. **Clone ou baixe o projeto**
   ```bash
   cd gestao_alunos_senac
   ```

2. **Ative o ambiente virtual**
   ```bash
   source venv/bin/activate
   ```

3. **Instale as dependências**
   ```bash
   pip install -r requirements.txt
   ```

4. **Inicialize o banco de dados com dados de exemplo**
   ```bash
   python src/init_data.py
   ```

5. **Execute o servidor**
   ```bash
   python src/main.py
   ```

6. **Acesse o sistema**
   - Abra seu navegador
   - Vá para: `http://localhost:5000`

## 👤 Credenciais de Acesso

**Usuário padrão:**
- Username: `admin`
- Senha: `admin123`

## 🎯 Como Usar

### 1. Login
- Acesse o sistema com as credenciais fornecidas
- O sistema redirecionará para a página principal

### 2. Cadastrar Aluno
- Clique em "Cadastrar Aluno" na página inicial
- Preencha todos os campos obrigatórios
- Clique em "Cadastrar"
- O sistema gerará automaticamente a matrícula

### 3. Listar Alunos
- Clique em "Encontrar Aluno" > "Listar Todos"
- Ou acesse via menu "Aluno" > "Listar"
- Visualize todos os alunos em formato de tabela

### 4. Buscar Alunos
- Clique em "Encontrar Aluno"
- Preencha os campos de busca (nome, CPF ou curso)
- Clique em "Buscar"

### 5. Editar Aluno
- Na listagem de alunos, clique no botão "✏️" do aluno desejado
- Modifique os dados necessários
- Clique em "Salvar Alterações"

### 6. Excluir Aluno
- Na listagem de alunos, clique no botão "🗑️" do aluno desejado
- Confirme a exclusão na janela de confirmação

## 🗂️ Estrutura do Projeto

```
gestao_alunos_senac/
├── src/
│   ├── models/          # Modelos do banco de dados
│   │   ├── user.py      # Modelo base SQLAlchemy
│   │   ├── aluno.py     # Modelo do Aluno
│   │   └── usuario.py   # Modelo do Usuário
│   ├── routes/          # Rotas da API
│   │   ├── user.py      # Rotas de usuário (template)
│   │   ├── aluno.py     # Rotas de alunos
│   │   └── auth.py      # Rotas de autenticação
│   ├── static/          # Arquivos estáticos
│   │   ├── index.html   # Página principal
│   │   ├── styles.css   # Estilos CSS
│   │   └── script.js    # JavaScript
│   ├── database/        # Banco de dados
│   │   └── app.db       # Arquivo SQLite
│   ├── main.py          # Arquivo principal do Flask
│   └── init_data.py     # Script para dados iniciais
├── venv/                # Ambiente virtual Python
├── requirements.txt     # Dependências Python
└── README.md           # Esta documentação
```

## 🎨 Design

O sistema segue o padrão visual do SENAC com:
- **Cores**: Tons de azul (#1e88e5, #1565c0)
- **Layout**: Design limpo e profissional
- **Responsividade**: Adaptável para diferentes tamanhos de tela
- **Usabilidade**: Interface intuitiva e fácil de usar

## 🔧 Configurações Avançadas

### Banco de Dados
- O sistema usa SQLite por padrão
- Para usar outro banco, modifique a `SQLALCHEMY_DATABASE_URI` em `main.py`

### Segurança
- Em produção, altere a `SECRET_KEY` em `main.py`
- Implemente hash de senhas para maior segurança
- Configure HTTPS para conexões seguras

### Personalização
- Modifique `styles.css` para alterar cores e layout
- Adicione novos campos no modelo `Aluno` conforme necessário
- Customize as validações em `script.js`

## 🐛 Solução de Problemas

### Erro de Porta em Uso
```bash
# Mate processos na porta 5000
sudo lsof -t -i tcp:5000 | xargs kill -9
```

### Erro de Dependências
```bash
# Reinstale as dependências
pip install --force-reinstall -r requirements.txt
```

### Erro de Banco de Dados
```bash
# Recrie o banco de dados
rm src/database/app.db
python src/init_data.py
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se todas as dependências estão instaladas
2. Confirme que o Python 3.11+ está sendo usado
3. Verifique se a porta 5000 está disponível
4. Consulte os logs do Flask para erros específicos

## 📄 Licença

Este projeto foi desenvolvido para uso educacional e interno do SENAC.

---

**Desenvolvido com ❤️ para o SENAC**

